// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Staking {
    IERC20 public ninjaToken;
    uint256 public totalStaked;
    mapping(address => uint256) public stakedBalances;
    mapping(address => uint256) public stakingTimestamps;

    /**
     * @notice Sets the Ninja Token address.
     * @dev Only the contract owner can set the Ninja Token address, and it can be set only once.
     * @param _ninjaToken The address of the Ninja Token contract.
     */
    function setNinjaToken(IERC20 _ninjaToken) external {
        ninjaToken = _ninjaToken;
    }

    /**
     * @notice Deposits ERC20 tokens into escrow.
     * @dev User can deposit ERC20 tokens, which will be tracked in the contract.
     * @param amount The amount of tokens to deposit.
     */
    function stake(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        ninjaToken.transferFrom(msg.sender, address(this), amount);
        stakedBalances[msg.sender] += amount;
        stakingTimestamps[msg.sender] = block.timestamp;
        totalStaked += amount;
    } 

    /**
     * @notice Withdraws staked ERC20 tokens from escrow.
     * @dev User can withdraw their staked tokens from the contract.
     * @param amount The amount of tokens to withdraw.
     */
    function withdraw(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(stakedBalances[msg.sender] >= amount, "Insufficient staked balance");
        stakedBalances[msg.sender] -= amount;
        totalStaked -= amount;
        ninjaToken.transfer(msg.sender, amount);
    }

    /**
     * @notice Retrieves the staked balance of a user.
     * @dev Returns the amount of tokens staked by the user.
     * @param user The address of the user to query.
     * @return The amount of tokens staked by the user.
     */
    function stakedBalanceOf(address user) external view returns (uint256) {
        return stakedBalances[user];
    }
}
