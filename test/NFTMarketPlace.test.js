const { expect } = require("chai");
const { ethers } = require("hardhat");

const toWei = num => ethers.utils.parseEther(num.toString());
const fromWei = num => ethers.utils.formatEther(num);

describe("NFTMarketPlace", async () => {
    let deployer, addr1, addr2, nft, marketplace;
    let feepercent = 1;
    let addrs;
    let URI = "sample URI";
    beforeEach(async () => {
        const NFT = await ethers.getContractFactory("NFT");
        const MARKETPLACE = await ethers.getContractFactory("MarketPlace");
        // Get signers
        [deployer, addr1, addr2, ...addrs] = await ethers.getSigners();
        // Deploy Contracts
        nft = await NFT.deploy(10);
        marketplace = await MARKETPLACE.deploy(feepercent);
    });

    describe("Deployment", async () => {
        it("Should track name and symbol of the nft collection", async () => {
            expect(await nft.name()).to.equal("Genshi_ NFT");
            expect(await nft.symbol()).to.equal("Genshi_");
        });

        it("should track artist address and royalty %", async () => {
            expect(await nft.artist()).to.equal(deployer.address);
            expect(await nft.royalitypercentage()).to.equal(10);
        });

        it("Should track feeAccount and feePercent of the marketplace", async () => {
            expect(await marketplace.feeAccount()).to.equal(deployer.address);
            expect(await marketplace.feePercent()).to.equal(feepercent);
        });
    });

    describe("Minting NFTs", () => {
        it("Should track each minted NFT", async () => {
            await nft.connect(addr1).mint(URI);
            expect(await nft.tokenCount()).to.equal(1);
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
            expect(await nft.tokenURI(1)).to.equal(URI);
            expect(await nft.royalitypercentage()).to.equal(10)
            
            await nft.connect(addr2).mint(URI);
            expect(await nft.tokenCount()).to.equal(2);
            expect(await nft.balanceOf(addr2.address)).to.equal(1);
            expect(await nft.tokenURI(2)).to.equal(URI);
            expect(await nft.royalitypercentage()).to.equal(10)
        });
    });

    describe("Making Marketplace items", () => {
        beforeEach(async () => {
            // addr1 mints an nft
            await nft.connect(addr1).mint(URI);
            // addr1 approves marketplace to sell nft
            await nft
                .connect(addr1)
                .setApprovalForAll(marketplace.address, true);
        });

        it("Should track newly created item,transfer NFT from seller to markteplace and emit offered item", async () => {
            await expect(
                marketplace.connect(addr1).createItem(nft.address, 1, toWei(1))
            )
                .to.emit(marketplace, "Offered")
                .withArgs(1, nft.address, 1, toWei(1), addr1.address);

            expect(await nft.ownerOf(1)).to.equal(marketplace.address);
            expect(await nft.artist()).to.equal(deployer.address)
            expect(await nft.royalitypercentage()).to.equal(10)
            expect(await marketplace.itemCount()).to.equal(1);
            // Get item from items mapping then check fields to ensure they are correct
            const item = await marketplace.items(1);
            expect(item.itemId).to.equal(1);
            expect(item.nft).to.equal(nft.address);
            expect(item.tokenId).to.equal(1);
            expect(item.price).to.equal(toWei(1));
            expect(item.sold).to.equal(false);
        });

        it("Should fail if price is set to zero", async function () {
            await expect(
                marketplace.connect(addr1).createItem(nft.address, 1, 0)
            ).to.be.revertedWith("Price must be greater than 0");
        });

        it("should store the artist and fees of nft", async () => {
            expect(await nft.artist()).to.equal(deployer.address);
        });
    });

    describe("Purchasing marketplace items", () => {
        let price = 2;
        let fee = (feepercent / 100) * price;
        let totalPriceInWei;
        beforeEach(async function () {
            // addr1 mints an nft
            await nft.connect(addr1).mint(URI);
            // addr1 approves marketplace to spend tokens
            await nft
                .connect(addr1)
                .setApprovalForAll(marketplace.address, true);
            // addr1 makes their nft a marketplace item.
            await marketplace
                .connect(addr1)
                .createItem(nft.address, 1
                    , toWei(price));
        });
        it("Should update item as sold, pay seller, transfer NFT to buyer, charge fees and emit a Bought event", async () => {
            const sellerInitalEthBal = await addr1.getBalance();
            const feeAccountInitialEthBal = await deployer.getBalance();
            // fetch items total price (market fees + item price)
            totalPriceInWei = await marketplace.gettotalPrice(1);
         
            // addr 2 purchases item.
            await expect(
                marketplace
                    .connect(addr2)
                    .purchaseItem(1, { value: totalPriceInWei })
            )
                .to.emit(marketplace, "Bought")
                .withArgs(
                    1,
                    nft.address,
                    1,
                    toWei(price),
                    addr1.address,
                    addr2.address
                );
            const sellerFinalEthBal = await addr1.getBalance();
            const feeAccountFinalEthBal = await deployer.getBalance();
            // Item should be marked as sold
            expect((await marketplace.items(1)).sold).to.equal(true);
            
            expect(+fromWei(sellerFinalEthBal)).to.equal(
                +price + +fromWei(sellerInitalEthBal)
            );
         
            expect(await nft.ownerOf(1)).to.equal(addr2.address);
            expect(await nft.artist()).to.equal(deployer.address);

            await marketplace
                .connect(addr2)
                .createItem(nft.address, 1, toWei(5));

            
                await expect(
                    marketplace
                        .connect(addrs[0])
                        .purchaseItem(1, { value: totalPriceInWei })
                )
                    .to.emit(marketplace, "Bought")
                    .withArgs(
                        1,
                        nft.address,
                        1,
                        toWei(price),
                        addr2.address,
                        addrs[0].address
                    );

                expect((await marketplace.items(1)).sold).to.equal(true);

        });
        it("Should fail for invalid item ids, sold items and when not enough ether is paid", async () => {
            // fails for invalid item ids
            await expect(
                marketplace
                    .connect(addr2)
                    .purchaseItem(2, { value: totalPriceInWei })
            ).to.be.revertedWith("Item does not exist");
            await expect(
                marketplace
                    .connect(addr2)
                    .purchaseItem(0, { value: totalPriceInWei })
            ).to.be.revertedWith("Item does not exist");
            // Fails when not enough ether is paid with the transaction.
            // In this instance, fails when buyer only sends enough ether to cover the price of the nft
            // not the additional market fee.
            await expect(
                marketplace
                    .connect(addr2)
                    .purchaseItem(1, { value: toWei(price) })
            ).to.be.revertedWith("Money where");
            // addr2 purchases item 1
            await marketplace
                .connect(addr2)
                .purchaseItem(1, { value: totalPriceInWei });
            // addr3 tries purchasing item 1 after its been sold
            const addr3 = addrs[0];
            await expect(
                marketplace
                    .connect(addr3)
                    .purchaseItem(1, { value: totalPriceInWei })
            ).to.be.revertedWith("Item not for sale");
        });
    });
});
