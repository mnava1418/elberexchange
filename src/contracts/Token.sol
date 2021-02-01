pragma solidity >=0.4.22 <0.8.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Token {
    using SafeMath for uint;

    //Variable
    string public name = "Elber Coin";
    string public symbol = "ELB";
    uint256 public decimals = 18;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf; //mapping is like a hashmap. In this case address is the key and the number is the value

    //Events
    //indexed help us to subscribe to events trigger for us
    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor() public {
        totalSupply = 1000000 * (10 ** decimals);
        balanceOf[msg.sender] = totalSupply; //We assign the total supply to the address that deploys the token to the blockchain
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        //msg.sendr is who calls the functions or who deploys the contract
        require(_to != address(0)); //checks _to address is a valid address
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
}