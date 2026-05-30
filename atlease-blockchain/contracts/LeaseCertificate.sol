// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LeaseCertificate
 * @dev Non-transferable (soulbound) NFT contract for lease certificates
 *      issued by the AtLease platform.
 *
 * OpenZeppelin v5 compatible.
 */
contract LeaseCertificate is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    /**
     * @dev Emitted when a lease certificate is minted
     */
    event LeaseCertificateMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        string tokenURI
    );

    /**
     * @dev Constructor initializes the ERC721 token with name and symbol
     *      and sets the deployer as the contract owner (platform wallet).
     */
    constructor() ERC721("AtLease Certificate", "ATLC") Ownable(msg.sender) {
        _tokenIdCounter = 1;
    }

    /**
     * @dev Mints a new lease certificate NFT.
     *
     * Requirements:
     * - Caller must be the contract owner (platform wallet)
     * - Recipient must not be the zero address
     */
    function mint(
        address recipient,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        require(recipient != address(0), "Cannot mint to zero address");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);

        emit LeaseCertificateMinted(tokenId, recipient, tokenURI);

        return tokenId;
    }

    /**
     * @dev Override OpenZeppelin v5 internal hook to block transfers.
     *
     * Rules:
     * - Allow minting      (from == address(0))
     * - Allow burning      (to == address(0)) [not used, but safe]
     * - Block all transfers (from != 0 && to != 0)
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = super._update(to, tokenId, auth);

        if (from != address(0) && to != address(0)) {
            revert("LeaseCertificate: Token transfers are disabled");
        }

        return from;
    }

    /**
     * @dev Returns the next token ID to be minted
     */
    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIdCounter;
    }
}
