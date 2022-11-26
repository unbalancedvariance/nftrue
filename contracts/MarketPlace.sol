// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./NFT.sol";
import "hardhat/console.sol";

contract MarketPlace is ReentrancyGuard {
    // Account which get fees
    address payable public immutable feeAccount;
    // % of fees
    uint public immutable feePercent;
    // Number of items
    uint public itemCount;

    mapping(address => address[]) nft_owned;
    mapping(address => address[]) nft_created;

    struct Item {
        uint itemId; //Id of the item
        IERC721 nft; //instance of nft contract
        uint tokenId; //Token Id
        uint price; //price of the nft
        address payable seller; // Seller address
        bool sold; // True if sold else false
    }

    mapping(uint => Item) public items;

    //indexed will allow us to search for offered event
    //using nft and seller
    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );

    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    constructor(uint _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    function createItem(
        IERC721 _nft,
        uint _tokenId,
        uint _price
    ) external nonReentrant {
        require(_price > 0, "Price must be greater than 0");
        itemCount++;
        _nft.transferFrom(msg.sender, address(this), _tokenId);

        items[itemCount] = Item(
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false
        );

        emit Offered(itemCount, address(_nft), _tokenId, _price, msg.sender);
        nft_created[msg.sender].push(address(_nft));
    }

    uint public royalty;

    function purchaseItem(uint _itemId) external payable nonReentrant {
        uint totalPrice = gettotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "Item does not exist");
        require(msg.value >= totalPrice, "Money where");
        require(!item.sold,"Item not for sale");

        // Transfer the nft ownership
        // Converting the interger value into bytes and the bytes value will be converted back to integer to calculate the transaction amount.
        address nftAddress = address(item.nft);
        NFT nft_token = NFT(nftAddress);

        address payable creator = nft_token.artist();
        uint royalitypercentage = nft_token.royalitypercentage();

        royalty = (item.price * royalitypercentage)/100;
        uint fees = totalPrice - item.price;
        item.price = item.price - royalty;
        creator.transfer(royalty);
        item.seller.transfer(item.price);
        feeAccount.transfer(fees);
        item.sold = true;   
        uint price = msg.value - totalPrice;
        payable(msg.sender).transfer(price);
        item.nft.safeTransferFrom(address(this), msg.sender, item.tokenId);

        emit Bought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );

        nft_owned[msg.sender].push(address(item.nft));

    }

    function gettotalPrice(uint _itemId) public view returns (uint) {
        return (items[_itemId].price * (100 + feePercent)) / 100;
    }

    function getAllCreatedNFTs() public view returns(address[] memory){
        return nft_created[msg.sender];
    }

    
    function getAllOwnedNFTs() public view returns(address[] memory){
        return nft_owned[msg.sender];
    }
}
