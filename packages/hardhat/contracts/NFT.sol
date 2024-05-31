// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * @title NFT
 * @dev A basic implementation of an ERC721 Non-Fungible Token using OpenZeppelin libraries.
 * This contract allows the minting of new tokens and includes metadata for each token.
 */
contract NFT is ERC721URIStorage {
	// Counter for the next token ID to be minted
	uint256 private _tokenIdCounter;

	/**
	 * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
	 * @param name The name of the NFT collection.
	 * @param symbol The symbol of the NFT collection.
	 */
	constructor(
		string memory name,
		string memory symbol
	) ERC721(name, symbol) {}

	/**
	 * @notice Mints a new token with a given URI to a specified address.
	 * @dev Only the owner of the contract can mint new tokens.
	 * @param to The address to which the newly minted token will be assigned.
	 * @param tokenURI The URI of the token metadata.
	 */
	function mint(address to, string memory tokenURI) external {
		uint256 tokenId = _tokenIdCounter;
		_tokenIdCounter += 1;

		_mint(to, tokenId);
		_setTokenURI(tokenId, tokenURI);
	}
}
