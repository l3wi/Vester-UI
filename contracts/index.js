import usdcInfo from "./usdc"
import VesterOutput from "./Vester.json"

export const usdc = usdcInfo
export const Vester = VesterOutput
export const VesterCode = `
// File: @openzeppelin/contracts/GSN/Context.sol

pragma solidity 0.5.17;
pragma experimental ABIEncoderV2;

/*
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with GSN meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
contract Context {
    // Empty internal constructor, to prevent people from mistakenly deploying
    // an instance of this contract, which should be used via inheritance.
    constructor () internal { }
    // solhint-disable-previous-line no-empty-blocks

    function _msgSender() internal view returns (address payable) {
        return msg.sender;
    }

    function _msgData() internal view returns (bytes memory) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}

// File: @openzeppelin/contracts/ownership/Ownable.sol

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * This module is used through inheritance. It will make available the modifier
 * \`onlyOwner\`, which can be applied to your functions to restrict their use to
 * the owner.
 */
contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor () internal {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(isOwner(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Returns true if the caller is the current owner.
     */
    function isOwner() public view returns (bool) {
        return _msgSender() == _owner;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * \`onlyOwner\` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (\`newOwner\`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (\`newOwner\`).
     */
    function _transferOwnership(address newOwner) internal {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

// File: @openzeppelin/contracts/math/SafeMath.sol

/**
 * @dev Wrappers over Solidity's arithmetic operations with added overflow
 * checks.
 *
 * Arithmetic operations in Solidity wrap on overflow. This can easily result
 * in bugs, because programmers usually assume that an overflow raises an
 * error, which is the standard behavior in high level programming languages.
 * \`SafeMath\` restores this intuition by reverting the transaction when an
 * operation overflows.
 *
 * Using this library instead of the unchecked operations eliminates an entire
 * class of bugs, so it's recommended to use it always.
 */
library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's \`+\` operator.
     *
     * Requirements:
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's \`-\` operator.
     *
     * Requirements:
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's \`-\` operator.
     *
     * Requirements:
     * - Subtraction cannot overflow.
     *
     * _Available since v2.4.0._
     */
    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's \`*\` operator.
     *
     * Requirements:
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's \`/\` operator. Note: this function uses a
     * \`revert\` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's \`/\` operator. Note: this function uses a
     * \`revert\` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     *
     * _Available since v2.4.0._
     */
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts when dividing by zero.
     *
     * Counterpart to Solidity's \`%\` operator. This function uses a \`revert\`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts with custom message when dividing by zero.
     *
     * Counterpart to Solidity's \`%\` operator. This function uses a \`revert\`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     *
     * _Available since v2.4.0._
     */
    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}

// File: @openzeppelin/contracts/token/ERC20/IERC20.sol

/**
 * @dev Interface of the ERC20 standard as defined in the EIP. Does not include
 * the optional functions; to access them see {ERC20Detailed}.
 */
interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by \`account\`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves \`amount\` tokens from the caller's account to \`recipient\`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that \`spender\` will be
     * allowed to spend on behalf of \`owner\` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets \`amount\` as the allowance of \`spender\` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves \`amount\` tokens from \`sender\` to \`recipient\` using the
     * allowance mechanism. \`amount\` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Emitted when \`value\` tokens are moved from one account (\`from\`) to
     * another (\`to\`).
     *
     * Note that \`value\` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a \`spender\` for an \`owner\` is set by
     * a call to {approve}. \`value\` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

// File: @openzeppelin/contracts/utils/Address.sol

/**
 * @dev Collection of functions related to the address type
 */
library Address {
    /**
     * @dev Returns true if \`account\` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, \`isContract\` will return false for the following 
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // According to EIP-1052, 0x0 is the value returned for not-yet created accounts
        // and 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470 is returned
        // for accounts without code, i.e. \`keccak256('')\`
        bytes32 codehash;
        bytes32 accountHash = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;
        // solhint-disable-next-line no-inline-assembly
        assembly { codehash := extcodehash(account) }
        return (codehash != accountHash && codehash != 0x0);
    }

    /**
     * @dev Converts an \`address\` into \`address payable\`. Note that this is
     * simply a type cast: the actual underlying value is not changed.
     *
     * _Available since v2.4.0._
     */
    function toPayable(address account) internal pure returns (address payable) {
        return address(uint160(account));
    }

    /**
     * @dev Replacement for Solidity's \`transfer\`: sends \`amount\` wei to
     * \`recipient\`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by \`transfer\`, making them unable to receive funds via
     * \`transfer\`. {sendValue} removes this limitation.
     *
     * https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to \`recipient\`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     *
     * _Available since v2.4.0._
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        // solhint-disable-next-line avoid-call-value
        (bool success, ) = recipient.call.value(amount)("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }
}

// File: @openzeppelin/contracts/token/ERC20/SafeERC20.sol

/**
 * @title SafeERC20
 * @dev Wrappers around ERC20 operations that throw on failure (when the token
 * contract returns false). Tokens that return no value (and instead revert or
 * throw on failure) are also supported, non-reverting calls are assumed to be
 * successful.
 * To use this library you can add a \`using SafeERC20 for ERC20;\` statement to your contract,
 * which allows you to call the safe operations as \`token.safeTransfer(...)\`, etc.
 */
library SafeERC20 {
    using SafeMath for uint256;
    using Address for address;

    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }

    function safeApprove(IERC20 token, address spender, uint256 value) internal {
        // safeApprove should only be called when setting an initial allowance,
        // or when resetting it to zero. To increase and decrease it, use
        // 'safeIncreaseAllowance' and 'safeDecreaseAllowance'
        // solhint-disable-next-line max-line-length
        require((value == 0) || (token.allowance(address(this), spender) == 0),
            "SafeERC20: approve from non-zero to non-zero allowance"
        );
        callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
    }

    function safeIncreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        uint256 newAllowance = token.allowance(address(this), spender).add(value);
        callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }

    function safeDecreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        uint256 newAllowance = token.allowance(address(this), spender).sub(value, "SafeERC20: decreased allowance below zero");
        callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     */
    function callOptionalReturn(IERC20 token, bytes memory data) private {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves.

        // A Solidity high level call has three parts:
        //  1. The target address is checked to verify it contains contract code
        //  2. The call itself is made, and success asserted
        //  3. The return value is decoded, which in turn checks the size of the returned data.
        // solhint-disable-next-line max-line-length
        require(address(token).isContract(), "SafeERC20: call to non-contract");

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = address(token).call(data);
        require(success, "SafeERC20: low-level call failed");

        if (returndata.length > 0) { // Return data is optional
            // solhint-disable-next-line max-line-length
            require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
        }
    }
}

// File: contracts/src/vester/TokenVesting.sol

/*
 * audit-info: Forked from OZ's TokenVesting:
 *             https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.5.0/contracts/drafts/TokenVesting.sol
 *
 *             Identical to the fork contract except for changing _beneficiary visibility to internal
 *             so that we can extend its functionality
 */

/**
 * @title TokenVesting
 * @dev A token holder contract that can release its token balance gradually like a
 * typical vesting scheme, with a cliff and vesting period. Optionally revocable by the
 * owner.
 */
contract TokenVesting is Ownable {
    // The vesting schedule is time-based (i.e. using block timestamps as opposed to e.g. block numbers), and is
    // therefore sensitive to timestamp manipulation (which is something miners can do, to a certain degree). Therefore,
    // it is recommended to avoid using short time durations (less than a minute). Typical vesting schemes, with a
    // cliff period of a year and a duration of four years, are safe to use.
    // solhint-disable not-rely-on-time

    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    event TokensReleased(address token, uint256 amount);
    event TokenVestingRevoked(address token);

    /**
     * audit-info: changed _beneficiary from private -> internal so that we can extend this functionality
     */

    // beneficiary of tokens after they are released
    address internal _beneficiary;

    // Durations and timestamps are expressed in UNIX time, the same units as block.timestamp.
    uint256 private _cliff;
    uint256 private _start;
    uint256 private _duration;

    bool private _revocable;

    mapping (address => uint256) internal _released;
    mapping (address => bool) private _revoked;

    /**
     * @dev Creates a vesting contract that vests its balance of any ERC20 token to the
     * beneficiary, gradually in a linear fashion until start + duration. By then all
     * of the balance will have vested.
     * @param beneficiary address of the beneficiary to whom vested tokens are transferred
     * @param cliffDuration duration in seconds of the cliff in which tokens will begin to vest
     * @param start the time (as Unix time) at which point vesting starts
     * @param duration duration in seconds of the period in which the tokens will vest
     * @param revocable whether the vesting is revocable or not
     */
    constructor (address beneficiary, uint256 start, uint256 cliffDuration, uint256 duration, bool revocable) public {
        require(beneficiary != address(0), "TokenVesting: beneficiary is the zero address");
        // solhint-disable-next-line max-line-length
        require(cliffDuration <= duration, "TokenVesting: cliff is longer than duration");
        require(duration > 0, "TokenVesting: duration is 0");
        // solhint-disable-next-line max-line-length
        require(start.add(duration) > block.timestamp, "TokenVesting: final time is before current time");

        _beneficiary = beneficiary;
        _revocable = revocable;
        _duration = duration;
        _cliff = start.add(cliffDuration);
        _start = start;
    }

    /**
     * @return the beneficiary of the tokens.
     */
    function beneficiary() public view returns (address) {
        return _beneficiary;
    }

    /**
     * @return the cliff time of the token vesting.
     */
    function cliff() public view returns (uint256) {
        return _cliff;
    }

    /**
     * @return the start time of the token vesting.
     */
    function start() public view returns (uint256) {
        return _start;
    }

    /**
     * @return the duration of the token vesting.
     */
    function duration() public view returns (uint256) {
        return _duration;
    }

    /**
     * @return true if the vesting is revocable.
     */
    function revocable() public view returns (bool) {
        return _revocable;
    }

    /**
     * @return the amount of the token released.
     */
    function released(address token) public view returns (uint256) {
        return _released[token];
    }

    /**
     * @return true if the token is revoked.
     */
    function revoked(address token) public view returns (bool) {
        return _revoked[token];
    }

    /**
     * @notice Allows the owner to revoke the vesting. Tokens already vested
     * remain in the contract, the rest are returned to the owner.
     * @param token ERC20 token which is being vested
     */
    function revoke(IERC20 token) public onlyOwner {
        require(_revocable, "TokenVesting: cannot revoke");
        require(!_revoked[address(token)], "TokenVesting: token already revoked");

        uint256 balance = token.balanceOf(address(this));

        uint256 unreleased = _releasableAmount(token);
        uint256 refund = balance.sub(unreleased);

        _revoked[address(token)] = true;

        token.safeTransfer(owner(), refund);

        emit TokenVestingRevoked(address(token));
    }

    /**
     * @dev Calculates the amount that has already vested but hasn't been released yet.
     * @param token ERC20 token which is being vested
     */
    function _releasableAmount(IERC20 token) internal view returns (uint256) {
        return _vestedAmount(token).sub(_released[address(token)]);
    }

    /**
     * @dev Calculates the amount that has already vested.
     * @param token ERC20 token which is being vested
     */
    function _vestedAmount(IERC20 token) private view returns (uint256) {
        uint256 currentBalance = token.balanceOf(address(this));
        uint256 totalBalance = currentBalance.add(_released[address(token)]);

        if (block.timestamp < _cliff) {
            return 0;
        } else if (block.timestamp >= _start.add(_duration) || _revoked[address(token)]) {
            return totalBalance;
        } else {
            return totalBalance.mul(block.timestamp.sub(_start)).div(_duration);
        }
    }
}

// File: @uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol

interface IUniswapV2Pair {
    event Approval(address indexed owner, address indexed spender, uint value);
    event Transfer(address indexed from, address indexed to, uint value);

    function name() external pure returns (string memory);
    function symbol() external pure returns (string memory);
    function decimals() external pure returns (uint8);
    function totalSupply() external view returns (uint);
    function balanceOf(address owner) external view returns (uint);
    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool);

    function DOMAIN_SEPARATOR() external view returns (bytes32);
    function PERMIT_TYPEHASH() external pure returns (bytes32);
    function nonces(address owner) external view returns (uint);

    function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external;

    event Mint(address indexed sender, uint amount0, uint amount1);
    event Burn(address indexed sender, uint amount0, uint amount1, address indexed to);
    event Swap(
        address indexed sender,
        uint amount0In,
        uint amount1In,
        uint amount0Out,
        uint amount1Out,
        address indexed to
    );
    event Sync(uint112 reserve0, uint112 reserve1);

    function MINIMUM_LIQUIDITY() external pure returns (uint);
    function factory() external view returns (address);
    function token0() external view returns (address);
    function token1() external view returns (address);
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
    function price0CumulativeLast() external view returns (uint);
    function price1CumulativeLast() external view returns (uint);
    function kLast() external view returns (uint);

    function mint(address to) external returns (uint liquidity);
    function burn(address to) external returns (uint amount0, uint amount1);
    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;
    function skim(address to) external;
    function sync() external;

    function initialize(address, address) external;
}

// File: contracts/src/lib/Decimal.sol

/*
    Copyright 2019 dYdX Trading Inc.
    Copyright 2020, 2021 Empty Set Squad <emptysetsquad@protonmail.com>

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

/**
 * @title Decimal
 * @notice Library that defines a fixed-point number with 18 decimal places.
 *
 * audit-info: Extended from dYdX's Decimal library:
 *             https://github.com/dydxprotocol/solo/blob/master/contracts/protocol/lib/Decimal.sol
 */
library Decimal {
    using SafeMath for uint256;

    // ============ Constants ============

    /**
     * @notice Fixed-point base for Decimal.D256 values
     */
    uint256 constant BASE = 10**18;

    // ============ Structs ============


    /**
     * @notice Main struct to hold Decimal.D256 state
     * @dev Represents the number value / BASE
     */
    struct D256 {
        /**
         * @notice Underlying value of the Decimal.D256
         */
        uint256 value;
    }

    // ============ Static Functions ============

    /**
     * @notice Returns a new Decimal.D256 struct initialized to represent 0.0
     * @return Decimal.D256 representation of 0.0
     */
    function zero()
    internal
    pure
    returns (D256 memory)
    {
        return D256({ value: 0 });
    }

    /**
     * @notice Returns a new Decimal.D256 struct initialized to represent 1.0
     * @return Decimal.D256 representation of 1.0
     */
    function one()
    internal
    pure
    returns (D256 memory)
    {
        return D256({ value: BASE });
    }

    /**
     * @notice Returns a new Decimal.D256 struct initialized to represent \`a\`
     * @param a Integer to transform to Decimal.D256 type
     * @return Decimal.D256 representation of integer\`a\`
     */
    function from(
        uint256 a
    )
    internal
    pure
    returns (D256 memory)
    {
        return D256({ value: a.mul(BASE) });
    }

    /**
     * @notice Returns a new Decimal.D256 struct initialized to represent \`a\` / \`b\`
     * @param a Numerator of ratio to transform to Decimal.D256 type
     * @param b Denominator of ratio to transform to Decimal.D256 type
     * @return Decimal.D256 representation of ratio \`a\` / \`b\`
     */
    function ratio(
        uint256 a,
        uint256 b
    )
    internal
    pure
    returns (D256 memory)
    {
        return D256({ value: getPartial(a, BASE, b) });
    }

    // ============ Self Functions ============

    /**
     * @notice Adds integer \`b\` to Decimal.D256 \`self\`
     * @param self Original Decimal.D256 number
     * @param b Integer to add to \`self\`
     * @return Resulting Decimal.D256
     */
    function add(
        D256 memory self,
        uint256 b
    )
    internal
    pure
    returns (D256 memory)
    {
        return D256({ value: self.value.add(b.mul(BASE)) });
    }

    /**
     * @notice Subtracts integer \`b\` from Decimal.D256 \`self\`
     * @param self Original Decimal.D256 number
     * @param b Integer to subtract from \`self\`
     * @return Resulting Decimal.D256
     */
    function sub(
        D256 memory self,
        uint256 b
    )
    internal
    pure
    returns (D256 memory)
    {
        return D256({ value: self.value.sub(b.mul(BASE)) });
    }

    /**
     * @notice Subtracts integer \`b\` from Decimal.D256 \`self\`
     * @dev Reverts on underflow with reason \`reason\`
     * @param self Original Decimal.D256 number
     * @param b Integer to subtract from \`self\`
     * @param reason Revert reason
     * @return Resulting Decimal.D256
     */
    function sub(
        D256 memory self,
        uint256 b,
        string memory reason
    )
    internal
    pure
    returns (D256 memory)
    {
        return D256({ value: self.value.sub(b.mul(BASE), reason) });
    }

    /**
     * @notice Subtracts integer \`b\` from Decimal.D256 \`self\`
     * @param self Original Decimal.D256 number
     * @param b Integer to subtract from \`self\`
     * @return 0 on underflow, or the Resulting Decimal.D256
     */
    function subOrZero(
        D256 memory self,
        uint256 b
    )
    internal
    pure
    returns (D256 memory)
    {
        uint256 amount = b.mul(BASE);
        return D256({ value: self.value > amount ? self.value.sub(amount) : 0 });
    }

    /**
     * @notice Multiplies Decimal.D256 \`self\` by integer \`b\`
     * @param self Original Decimal.D256 number
     * @param b Integer to multiply \`self\` by
     * @return Resulting Decimal.D256
     */
    function mul(
        D256 memory self,
        uint256 b
    )
    internal
    pure
    returns (D256 memory)
    {
        return D256({ value: self.value.mul(b) });
    }

    /**
     * @notice Divides Decimal.D256 \`self\` by integer \`b\`
     * @param self Original Decimal.D256 number
     * @param b Integer to divide \`self\` by
     * @return Resulting Decimal.D256
     */
    function div(
        D256 memory self,
        uint256 b
    )
    internal
    pure
    returns (D256 memory)
    {
        return D256({ value: self.value.div(b) });
    }

    /**
     * @notice Divides Decimal.D256 \`self\` by integer \`b\`
     * @dev Reverts on divide-by-zero with reason \`reason\`
     * @param self Original Decimal.D256 number
     * @param b Integer to divide \`self\` by
     * @param reason Revert reason
     * @return Resulting Decimal.D256
     */
    function div(
        D256 memory self,
        uint256 b,
        string memory reason
    )
    internal
    pure
    returns (D256 memory)
    {
        return D256({ value: self.value.div(b, reason) });
    }

    /**
     * @notice Exponentiates Decimal.D256 \`self\` to the power of integer \`b\`
     * @dev Not optimized - is only suitable to use with small exponents
     * @param self Original Decimal.D256 number
     * @param b Integer exponent
     * @return Resulting Decimal.D256
     */
    function pow(
        D256 memory self,
        uint256 b
    )
    internal
    pure
    returns (D256 memory)
    {
        if (b == 0) {
            return from(1);
        }

        D256 memory temp = D256({ value: self.value });
        for (uint256 i = 1; i < b; i++) {
            temp = mul(temp, self);
        }

        return temp;
    }

    /**
     * @notice Adds Decimal.D256 \`b\` to Decimal.D256 \`self\`
     * @param self Original Decimal.D256 number
     * @param b Decimal.D256 to add to \`self\`
     * @return Resulting Decimal.D256
     */
    function add(
        D256 memory self,
        D256 memory b
    )
    internal
    pure
    returns (D256 memory)
    {
        return D256({ value: self.value.add(b.value) });
    }

    /**
     * @notice Subtracts Decimal.D256 \`b\` from Decimal.D256 \`self\`
     * @param self Original Decimal.D256 number
     * @param b Decimal.D256 to subtract from \`self\`
     * @return Resulting Decimal.D256
     */
    function sub(
        D256 memory self,
        D256 memory b
    )
    internal
    pure
    returns (D256 memory)
    {
        return D256({ value: self.value.sub(b.value) });
    }

    /**
     * @notice Subtracts Decimal.D256 \`b\` from Decimal.D256 \`self\`
     * @dev Reverts on underflow with reason \`reason\`
     * @param self Original Decimal.D256 number
     * @param b Decimal.D256 to subtract from \`self\`
     * @param reason Revert reason
     * @return Resulting Decimal.D256
     */
    function sub(
        D256 memory self,
        D256 memory b,
        string memory reason
    )
    internal
    pure
    returns (D256 memory)
    {
        return D256({ value: self.value.sub(b.value, reason) });
    }

    /**
     * @notice Subtracts Decimal.D256 \`b\` from Decimal.D256 \`self\`
     * @param self Original Decimal.D256 number
     * @param b Decimal.D256 to subtract from \`self\`
     * @return 0 on underflow, or the Resulting Decimal.D256
     */
    function subOrZero(
        D256 memory self,
        D256 memory b
    )
    internal
    pure
    returns (D256 memory)
    {
        return D256({ value: self.value > b.value ? self.value.sub(b.value) : 0 });
    }

    /**
     * @notice Multiplies Decimal.D256 \`self\` by Decimal.D256 \`b\`
     * @param self Original Decimal.D256 number
     * @param b Decimal.D256 to multiply \`self\` by
     * @return Resulting Decimal.D256
     */
    function mul(
        D256 memory self,
        D256 memory b
    )
    internal
    pure
    returns (D256 memory)
    {
        return D256({ value: getPartial(self.value, b.value, BASE) });
    }

    /**
     * @notice Divides Decimal.D256 \`self\` by Decimal.D256 \`b\`
     * @param self Original Decimal.D256 number
     * @param b Decimal.D256 to divide \`self\` by
     * @return Resulting Decimal.D256
     */
    function div(
        D256 memory self,
        D256 memory b
    )
    internal
    pure
    returns (D256 memory)
    {
        return D256({ value: getPartial(self.value, BASE, b.value) });
    }

    /**
     * @notice Divides Decimal.D256 \`self\` by Decimal.D256 \`b\`
     * @dev Reverts on divide-by-zero with reason \`reason\`
     * @param self Original Decimal.D256 number
     * @param b Decimal.D256 to divide \`self\` by
     * @param reason Revert reason
     * @return Resulting Decimal.D256
     */
    function div(
        D256 memory self,
        D256 memory b,
        string memory reason
    )
    internal
    pure
    returns (D256 memory)
    {
        return D256({ value: getPartial(self.value, BASE, b.value, reason) });
    }

    /**
     * @notice Checks if \`b\` is equal to \`self\`
     * @param self Original Decimal.D256 number
     * @param b Decimal.D256 to compare
     * @return Whether \`b\` is equal to \`self\`
     */
    function equals(D256 memory self, D256 memory b) internal pure returns (bool) {
        return self.value == b.value;
    }

    /**
     * @notice Checks if \`b\` is greater than \`self\`
     * @param self Original Decimal.D256 number
     * @param b Decimal.D256 to compare
     * @return Whether \`b\` is greater than \`self\`
     */
    function greaterThan(D256 memory self, D256 memory b) internal pure returns (bool) {
        return compareTo(self, b) == 2;
    }

    /**
     * @notice Checks if \`b\` is less than \`self\`
     * @param self Original Decimal.D256 number
     * @param b Decimal.D256 to compare
     * @return Whether \`b\` is less than \`self\`
     */
    function lessThan(D256 memory self, D256 memory b) internal pure returns (bool) {
        return compareTo(self, b) == 0;
    }

    /**
     * @notice Checks if \`b\` is greater than or equal to \`self\`
     * @param self Original Decimal.D256 number
     * @param b Decimal.D256 to compare
     * @return Whether \`b\` is greater than or equal to \`self\`
     */
    function greaterThanOrEqualTo(D256 memory self, D256 memory b) internal pure returns (bool) {
        return compareTo(self, b) > 0;
    }

    /**
     * @notice Checks if \`b\` is less than or equal to \`self\`
     * @param self Original Decimal.D256 number
     * @param b Decimal.D256 to compare
     * @return Whether \`b\` is less than or equal to \`self\`
     */
    function lessThanOrEqualTo(D256 memory self, D256 memory b) internal pure returns (bool) {
        return compareTo(self, b) < 2;
    }

    /**
     * @notice Checks if \`self\` is equal to 0
     * @param self Original Decimal.D256 number
     * @return Whether \`self\` is equal to 0
     */
    function isZero(D256 memory self) internal pure returns (bool) {
        return self.value == 0;
    }

    /**
     * @notice Truncates the decimal part of \`self\` and returns the integer value as a uint256
     * @param self Original Decimal.D256 number
     * @return Truncated Integer value as a uint256
     */
    function asUint256(D256 memory self) internal pure returns (uint256) {
        return self.value.div(BASE);
    }

    // ============ General Math ============

    /**
     * @notice Determines the minimum of \`a\` and \`b\`
     * @param a First Decimal.D256 number to compare
     * @param b Second Decimal.D256 number to compare
     * @return Resulting minimum Decimal.D256
     */
    function min(D256 memory a, D256 memory b) internal pure returns (Decimal.D256 memory) {
        return lessThan(a, b) ? a : b;
    }

    /**
     * @notice Determines the maximum of \`a\` and \`b\`
     * @param a First Decimal.D256 number to compare
     * @param b Second Decimal.D256 number to compare
     * @return Resulting maximum Decimal.D256
     */
    function max(D256 memory a, D256 memory b) internal pure returns (Decimal.D256 memory) {
        return greaterThan(a, b) ? a : b;
    }

    // ============ Core Methods ============

    /**
     * @notice Multiplies \`target\` by ratio \`numerator\` / \`denominator\`
     * @dev Internal only - helper
     * @param target Original Integer number
     * @param numerator Integer numerator of ratio
     * @param denominator Integer denominator of ratio
     * @return Resulting Decimal.D256 number
     */
    function getPartial(
        uint256 target,
        uint256 numerator,
        uint256 denominator
    )
    private
    pure
    returns (uint256)
    {
        return target.mul(numerator).div(denominator);
    }

    /**
     * @notice Multiplies \`target\` by ratio \`numerator\` / \`denominator\`
     * @dev Internal only - helper
     *      Reverts on divide-by-zero with reason \`reason\`
     * @param target Original Integer number
     * @param numerator Integer numerator of ratio
     * @param denominator Integer denominator of ratio
     * @param reason Revert reason
     * @return Resulting Decimal.D256 number
     */
    function getPartial(
        uint256 target,
        uint256 numerator,
        uint256 denominator,
        string memory reason
    )
    private
    pure
    returns (uint256)
    {
        return target.mul(numerator).div(denominator, reason);
    }

    /**
     * @notice Compares Decimal.D256 \`a\` to Decimal.D256 \`b\`
     * @dev Internal only - helper
     * @param a First Decimal.D256 number to compare
     * @param b Second Decimal.D256 number to compare
     * @return 0 if a < b, 1 if a == b, 2 if a > b
     */
    function compareTo(
        D256 memory a,
        D256 memory b
    )
    private
    pure
    returns (uint256)
    {
        if (a.value == b.value) {
            return 1;
        }
        return a.value > b.value ? 2 : 0;
    }
}

// File: contracts/src/Interfaces.sol

/*
    Copyright 2020, 2021 Empty Set Squad <emptysetsquad@protonmail.com>

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

/**
 * @title IManagedToken
 * @notice Generic interface for ERC20 tokens that can be minted and burned by their owner
 * @dev Used by Dollar and Stake in this protocol
 */
interface IManagedToken {

    /**
     * @notice Mints \`amount\` tokens to the {owner}
     * @param amount Amount of token to mint
     */
    function burn(uint256 amount) external;

    /**
     * @notice Burns \`amount\` tokens from the {owner}
     * @param amount Amount of token to burn
     */
    function mint(uint256 amount) external;
}

/**
 * @title IGovToken
 * @notice Generic interface for ERC20 tokens that have Compound-governance features
 * @dev Used by Stake and other compatible reserve-held tokens
 */
interface IGovToken {

    /**
     * @notice Delegate votes from \`msg.sender\` to \`delegatee\`
     * @param delegatee The address to delegate votes to
     */
    function delegate(address delegatee) external;
}

/**
 * @title IReserve
 * @notice Interface for the protocol reserve
 */
interface IReserve {
    /**
     * @notice The price that one ESD can currently be sold to the reserve for
     * @dev Returned as a Decimal.D256
     *      Normalizes for decimals (e.g. 1.00 USDC == Decimal.one())
     * @return Current ESD redemption price
     */
    function redeemPrice() external view returns (Decimal.D256 memory);
}

interface IRegistry {
    /**
     * @notice USDC token contract
     */
    function usdc() external view returns (address);

    /**
     * @notice Compound protocol cUSDC pool
     */
    function cUsdc() external view returns (address);

    /**
     * @notice ESD stablecoin contract
     */
    function dollar() external view returns (address);

    /**
     * @notice ESDS governance token contract
     */
    function stake() external view returns (address);

    /**
     * @notice ESD reserve contract
     */
    function reserve() external view returns (address);

    /**
     * @notice ESD governor contract
     */
    function governor() external view returns (address);

    /**
     * @notice ESD timelock contract, owner for the protocol
     */
    function timelock() external view returns (address);

    /**
     * @notice Migration contract to bride v1 assets with current system
     */
    function migrator() external view returns (address);

    /**
     * @notice Registers a new address for USDC
     * @dev Owner only - governance hook
     * @param newValue New address to register
     */
    function setUsdc(address newValue) external;

    /**
     * @notice Registers a new address for cUSDC
     * @dev Owner only - governance hook
     * @param newValue New address to register
     */
    function setCUsdc(address newValue) external;

    /**
     * @notice Registers a new address for ESD
     * @dev Owner only - governance hook
     * @param newValue New address to register
     */
    function setDollar(address newValue) external;

    /**
     * @notice Registers a new address for ESDS
     * @dev Owner only - governance hook
     * @param newValue New address to register
     */
    function setStake(address newValue) external;

    /**
     * @notice Registers a new address for the reserve
     * @dev Owner only - governance hook
     * @param newValue New address to register
     */
    function setReserve(address newValue) external;

    /**
     * @notice Registers a new address for the governor
     * @dev Owner only - governance hook
     * @param newValue New address to register
     */
    function setGovernor(address newValue) external;

    /**
     * @notice Registers a new address for the timelock
     * @dev Owner only - governance hook
     *      Does not automatically update the owner of all owned protocol contracts
     * @param newValue New address to register
     */
    function setTimelock(address newValue) external;

    /**
     * @notice Registers a new address for the v1 migration contract
     * @dev Owner only - governance hook
     * @param newValue New address to register
     */
    function setMigrator(address newValue) external;
}

// File: contracts/src/vester/Vester.sol

/*
    Copyright 2020, 2021 Empty Set Squad <emptysetsquad@protonmail.com>

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

/**
 * @title Vesting
 * @notice Generic ERC20 token vesting contract, which additionally supports COMP-style governance
 * @dev Extension of the OZ TokenVesting contract with support for beneficiary transfer and COMP-style
 *      governance participation with unvested tokens
 */
contract Vester is TokenVesting {

    /**
     * @notice Emitted when {beneficiary} transfers beneficiary to \`newBeneficiary\`
     */
    event BeneficiaryTransfer(address newBeneficiary);

    /**
     * @dev Creates a vesting contract that vests its balance of any ERC20 token to the
     * beneficiary, gradually in a linear fashion until start + duration. By then all
     * of the balance will have vested.
     * @param beneficiary address of the beneficiary to whom vested tokens are transferred
     * @param cliffDuration duration in seconds of the cliff in which tokens will begin to vest
     * @param start the time (as Unix time) at which point vesting starts
     * @param duration duration in seconds of the period in which the tokens will vest
     * @param revocable whether the vesting is revocable or not
     */
    constructor (address beneficiary, uint256 start, uint256 cliffDuration, uint256 duration, bool revocable)
    TokenVesting(beneficiary, start, cliffDuration, duration, revocable) public { }

    /**
     * @notice Allows the current {beneficiary} to transfer beneficiary status to a new address
     * @dev Beneficiary only
     * @param newBeneficiary New beneficiary address
     */
    function transferBeneficiary(address newBeneficiary) external onlyBeneficiary {
        require(newBeneficiary != address(0), "Vester: zero address");
        _beneficiary = newBeneficiary;
        emit BeneficiaryTransfer(newBeneficiary);
    }

    /**
     * @notice Delegates voting power to \`delegatee\` for \`token\` governance token held by the vesting contract
     * @dev Beneficiary only
     *      Works for all COMP-style governance tokens
     * @param token Governance token to delegate voting power
     * @param delegatee Account to receive voting power
     */
    function delegate(address token, address delegatee) external onlyBeneficiary {
        IGovToken(token).delegate(delegatee);
    }

    /**
     * @notice Transfers the specified \`amount\` of vested \`token\` to beneficiary. Only callable by beneficiary
     * @param token ERC20 token which is being vested
     * @param amount Quantity of token to be released
     */
    function release(IERC20 token, uint256 amount) public onlyBeneficiary {
        uint256 unreleased = _releasableAmount(token);
        uint256 releaseAmount = unreleased > amount ? amount : unreleased;

        require(releaseAmount > 0, "TokenVesting: no tokens are due");

        _released[address(token)] = _released[address(token)].add(releaseAmount);

        token.safeTransfer(_beneficiary, releaseAmount);

        emit TokensReleased(address(token), releaseAmount);
    }

    /**
     * @notice passthrough to internal _releaseableAmount function
     * @dev Returns the amount that has already vested but hasn't been released yet.
     * @param token ERC20 token which is being vested
     */
    function releaseableAmount(IERC20 token) public view returns (uint256) {
        return _releasableAmount(token);
    }

    /**
     * @notice Only beneficiary may call
     */
    modifier onlyBeneficiary {
        require(msg.sender == beneficiary(), "Vester: not beneficiary");

        _;
    }
}
`
