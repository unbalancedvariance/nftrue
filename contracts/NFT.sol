// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NFT is ERC721URIStorage {
    uint public tokenCount;

    address payable public artist;
    // address public txFeeToken;
    uint public royalitypercentage;
    mapping(address => bool) public excludedlist;
    uint public balance;

    constructor(
        uint _royalitypercentage
    ) ERC721("Genshi_ NFT", "Genshi_") {
        artist = payable(msg.sender);
        royalitypercentage = _royalitypercentage;
        excludedlist[artist] = true;
    }

    function set_excluded(address excluded, bool status) external {
        require(msg.sender == artist, "artist only");
        excludedlist[excluded] = status;
    }

    function changeRoyalty(uint royalty) external {
        royalitypercentage = royalty;
    }

    function mint(string memory _tokenURI) external returns (uint) {
        tokenCount++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        return tokenCount;
    }
}
