pragma solidity >=0.4.22 <0.8.0;

contract Token {
    string public name = "Elber Coin";
    string public symbol = "ELB";
    uint256 public decimals = 18;
    uint256 public totalSupply;

    //Track balances
    mapping(address => uint256) public balanceOf; //mapping is like a hashmap. In this case adress is the key and the number is the value


    constructor() public {
        totalSupply = 1000000 * (10 ** decimals);
        balanceOf[msg.sender] = totalSupply; //We assign the total supply to the address that deploys the token to the blockchain
    }
}