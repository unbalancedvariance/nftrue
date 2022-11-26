const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    // deploy contracts here:
    let royaltyPercent = 10
	// Deploying NFT contract
	const NFT = await ethers.getContractFactory("NFT")
	const nft = await NFT.deploy(royaltyPercent)

	console.log("NFT Contract hosted at",nft.address)
    // For each contract, pass the deployed contract and name to this function to save a copy of the contract ABI and address to the front end.
    saveFrontendFiles(nft,"NFT");

    // Deploying Marketplace
    // Deploying NFT contract
	const MARKETPLACE = await ethers.getContractFactory("MarketPlace")
	const marketplace = await MARKETPLACE.deploy(1)

	console.log("MarketPlace Contract hosted at",marketplace.address)
    // For each contract, pass the deployed contract and name to this function to save a copy of the contract ABI and address to the front end.
    saveFrontendFiles(marketplace,"MarketPlace");
}

function saveFrontendFiles(contract, name) {
    const fs = require("fs");
    const contractsDir = "../src/contractsData";

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    fs.writeFileSync(
        contractsDir + `/${name}-address.json`,
        JSON.stringify({ address: contract.address }, undefined, 2)
    );

    const contractArtifact = artifacts.readArtifactSync(name);

    fs.writeFileSync(
        contractsDir + `/${name}.json`,
        JSON.stringify(contractArtifact, null, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
