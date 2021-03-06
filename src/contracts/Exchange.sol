pragma solidity >=0.4.22 <0.8.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./Token.sol";

contract Exchange {
    using SafeMath for uint;

    address public feeAccount;
    uint256 public feePercent;
    address constant ETHER = address(0); //placeholder to keep track of the ETHER
    mapping(address => mapping(address => uint256)) public tokens;
    mapping(uint256 => _Order) public orders;
    mapping(uint256 => bool) public canceledOrders;
    mapping(uint256 => bool) public filledOrders;
    uint256 public orderCount;

    event Deposit(address _token, address _user, uint256 _amount, uint256 _balance);
    event WithDraw(address _token, address _user, uint256 _amount, uint256 _balance);
    event Order(
        uint256 id,
        address user,
        address tokenGet,
        uint amountGet,
        address tokenGive,
        uint amountGive,
        uint timeStamp
    );

    event Cancel(
        uint256 id,
        address user,
        address tokenGet,
        uint amountGet,
        address tokenGive,
        uint amountGive,
        uint timeStamp
    );

    event Trade(
        uint256 id,
        address user,
        address tokenGet,
        uint amountGet,
        address tokenGive,
        uint amountGive,
        address userFill,
        uint timeStamp
    );

    struct _Order {
        uint256 id;
        address user;
        address tokenGet;
        uint amountGet;
        address tokenGive;
        uint amountGive;
        uint timeStamp;
    }

    constructor(address _feeAccount, uint256 _feePercent) public {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    function depositTokens (address _token, uint256 _value) public {
        require(Token(_token).transferFrom(msg.sender, address(this), _value));
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_value);
        emit Deposit(_token, msg.sender, _value, tokens[_token][msg.sender]);
    }

    function withdrawTokens(address _token, uint256 _amount) public {
        require(tokens[_token][msg.sender] >= _amount);
        require(Token(_token).transfer(msg.sender, _amount));
        tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
        emit WithDraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function depositETH () payable public {
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }

    function withdrawETH (uint256 _amount) public{
        require(tokens[ETHER][msg.sender] >= _amount);
        msg.sender.transfer(_amount);
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
        emit WithDraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
    }

    function checkBalance (address _token, address _user ) public view returns (uint256) {
        return tokens[_token][_user];
    }

    function createOrder (address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive) public {
        require(tokens[_tokenGive][msg.sender] >= _amountGive);
        orderCount = orderCount + 1;
        orders[orderCount] = _Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, block.timestamp);
        emit Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, block.timestamp);
    }

    function cancelOrder(uint256 _id) public {
        _Order memory _order = orders[_id];
        require(_order.id == _id);
        require(_order.user == msg.sender);
        canceledOrders[_id] = true;
        emit Cancel(_order.id, msg.sender, _order.tokenGet, _order.amountGet, _order.tokenGive, _order.amountGive, _order.timeStamp);
    }

    function fillOrder(uint256 _id) public {
        require(_id > 0 && _id <= orderCount);
        require(!canceledOrders[_id]);
        require(!filledOrders[_id]);
        _Order memory _order = orders[_id];
        _trade(_order.id, _order.user, _order.tokenGet, _order.amountGet, _order.tokenGive, _order.amountGive);
        filledOrders[_id] = true;
    }

    function _trade(uint256 _orderId, address _user, address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive) internal {
        
        tokens[_tokenGet][msg.sender] = tokens[_tokenGet][msg.sender].sub(_amountGet);
        tokens[_tokenGet][_user] = tokens[_tokenGet][_user].add(_amountGet);
        
        tokens[_tokenGive][msg.sender] = tokens[_tokenGive][msg.sender].add(_amountGive);
        tokens[_tokenGive][_user] = tokens[_tokenGive][_user].sub(_amountGive);
        
        emit Trade(_orderId, _user, _tokenGet, _amountGet, _tokenGive, _amountGive, msg.sender, block.timestamp);
    }

    //Fallback funtion: reverts if ETH is sent directly to the smart contract
    fallback() external {
        revert();
    }
}