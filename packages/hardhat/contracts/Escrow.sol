// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title GameEscrow
 * @dev This contract allows two users to deposit tokens into escrow,
 * play a game off-chain, and have the winner receive the funds minus a fee.
 */
contract Escrow is Ownable {
	using SafeERC20 for IERC20;

	IERC20 public immutable escrowToken;
	uint256 public fee;
	uint256 private escrowCounter;

	enum EscrowType {
		ETH,
		ERC20
	}

	struct Escrow {
		uint256 id;
		EscrowType escrowType;
		address depositor1;
		address depositor2;
		uint256 amount;
		bool isReleased;
		string gameData;
	}

	mapping(uint256 => Escrow) public escrows;
	mapping(address => uint256[]) public userEscrows;

	/**
	 * @dev Emitted when a deposit is made.
	 * @param user The address of the user making the deposit.
	 * @param amount The amount of the deposit.
	 * @param escrowType The type of the deposit (ETH or ERC20).
	 * @param escrowId The ID of the escrow.
	 */
	event Deposited(
		address indexed user,
		uint256 amount,
		EscrowType escrowType,
		uint256 escrowId
	);

	/**
	 * @dev Emitted when funds are released to the winner.
	 * @param winner The address of the winner.
	 * @param amount The amount released to the winner.
	 * @param escrowId The ID of the escrow.
	 */
	event Released(address indexed winner, uint256 amount, uint256 escrowId);

	/**
	 * @dev Constructor that initializes the contract with a specific ERC20 token and fee.
	 * @param _escrowToken The address of the ERC20 token to be used in the escrow.
	 * @param _fee The fee percentage (e.g., 1 for 1%).
	 */
	constructor(
		IERC20 _escrowToken,
		uint256 _fee,
		address _initialOwner
	) Ownable(_initialOwner) {
		require(_fee <= 100, "Fee must be less than or equal to 100%");
		escrowToken = _escrowToken;
		fee = _fee;
	}

	/**
	 * @notice Deposits native Ether into escrow.
	 * @dev User can deposit ETH, which will be tracked in the contract.
	 */
	function depositEth() external payable {
		require(msg.value > 0, "Must deposit more than 0 ETH");

		uint256 escrowId = escrowCounter++;
		escrows[escrowId] = Escrow({
			id: escrowId,
			escrowType: EscrowType.ETH,
			depositor1: msg.sender,
			depositor2: address(0),
			amount: msg.value,
			isReleased: false,
			gameData: ""
		});

		userEscrows[msg.sender].push(escrowId);
		emit Deposited(msg.sender, msg.value, EscrowType.ETH, escrowId);
	}

	/**
	 * @notice Deposits ERC20 tokens into escrow.
	 * @dev User can deposit ERC20 tokens, which will be tracked in the contract.
	 * @param amount The amount of tokens to deposit.
	 */
	function depositToken(uint256 amount) external {
		require(amount > 0, "Must deposit more than 0 tokens");

		escrowToken.safeTransferFrom(msg.sender, address(this), amount);

		uint256 escrowId = escrowCounter++;
		escrows[escrowId] = Escrow({
			id: escrowId,
			escrowType: EscrowType.ERC20,
			depositor1: msg.sender,
			depositor2: address(0),
			amount: amount,
			isReleased: false,
			gameData: ""
		});

		userEscrows[msg.sender].push(escrowId);
		emit Deposited(msg.sender, amount, EscrowType.ERC20, escrowId);
	}

	/**
	 * @notice Allows the second user to deposit the same amount and token type as the initial escrow.
	 * @param escrowId The ID of the escrow to join.
	 */
	function joinEscrow(uint256 escrowId) external payable {
		Escrow storage escrow = escrows[escrowId];
		require(escrow.depositor1 != address(0), "Invalid escrow ID");
		require(escrow.depositor2 == address(0), "Escrow already joined");
		require(escrow.depositor1 != msg.sender, "Cannot join your own escrow");

		if (escrow.escrowType == EscrowType.ETH) {
			require(msg.value == escrow.amount, "Incorrect Ether amount sent");
		} else {
			escrowToken.safeTransferFrom(
				msg.sender,
				address(this),
				escrow.amount
			);
		}

		escrow.depositor2 = msg.sender;
		userEscrows[msg.sender].push(escrowId);

		emit Deposited(msg.sender, escrow.amount, escrow.escrowType, escrowId);
	}

	/**
	 * @notice Releases the escrowed funds to the winner.
	 * @dev This function can only be called by the owner.
	 * @param escrowId The ID of the escrow to release.
	 * @param winner The address of the winner.
	 * @param gameData The data from the game that was played.
	 */
	function releaseFunds(
		uint256 escrowId,
		address payable winner,
		string calldata gameData
	) external onlyOwner {
		Escrow storage escrow = escrows[escrowId];
		require(!escrow.isReleased, "Funds already released");
		require(escrow.amount > 0, "No funds to release");
		require(escrow.depositor2 != address(0), "Escrow not fully funded");

		uint256 totalAmount = escrow.amount * 2;
		uint256 feeAmount = (totalAmount * fee) / 100;
		uint256 winnerAmount = totalAmount - feeAmount;

		escrow.isReleased = true;
		escrow.gameData = gameData;

		if (escrow.escrowType == EscrowType.ETH) {
			// Transfer the remaining amount to the winner in ETH
			winner.transfer(winnerAmount);
		} else {
			// Transfer the fee and remaining amount to the respective addresses in ERC20
			escrowToken.safeTransfer(owner(), feeAmount);
			escrowToken.safeTransfer(winner, winnerAmount);
		}

		emit Released(winner, winnerAmount, escrowId);
	}

	/**
	 * @notice Allows the owner to release any stuck or unclaimed funds to an address of their choosing.
	 * @param escrowId The ID of the escrow to recover.
	 * @param recipient The address to send the recovered funds to.
	 */
	function recoverFunds(
		uint256 escrowId,
		address payable recipient
	) external onlyOwner {
		Escrow storage escrow = escrows[escrowId];
		require(!escrow.isReleased, "Funds already released");
		require(escrow.amount > 0, "No funds to recover");

		uint256 totalAmount = escrow.depositor2 == address(0)
			? escrow.amount
			: escrow.amount * 2;
		escrow.isReleased = true;

		if (escrow.escrowType == EscrowType.ETH) {
			// Transfer the amount to the recipient in ETH
			recipient.transfer(totalAmount);
		} else {
			// Transfer the amount to the recipient in ERC20
			escrowToken.safeTransfer(recipient, totalAmount);
		}
	}
}
