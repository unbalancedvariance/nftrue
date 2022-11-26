// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NFT is ERC721URIStorage {
    uint public tokenCount;

    address payable[] public artist;
    address payable public currentOwner;
    // address public txFeeToken;
    uint public royalitypercentage;
    mapping(address => bool) public excludedlist;
    uint public balance;

    constructor(
        uint _royalitypercentage
    ) ERC721("Genshi_ NFT", "Genshi_") {
        artist.push(payable(msg.sender));
        currentOwner = payable(msg.sender);
        royalitypercentage = _royalitypercentage;
        excludedlist[artist[0]] = true;
    }

    function setOwner(address payable addr) external{
        currentOwner = addr;
    }

    function set_excluded(address excluded, bool status) external {
        require(msg.sender == artist[0], "artist only");
        excludedlist[excluded] = status;
    }

    function changeRoyalty(uint royalty) external {
        royalitypercentage = royalty;
    }

    function addArtists(address payable artists) external {
        artist.push(artists);
    }

    function getArtist_i(uint i) view external returns(address payable){
        return artist[i];
    }

    function getLength() view external returns(uint){
        return artist.length;
    }

    function mint(string memory _tokenURI) external returns (uint) {
        tokenCount++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        return tokenCount;
    }
}
