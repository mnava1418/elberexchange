const Token = artifacts.require("Token");
const Exchange = artifacts.require("Exchange")

const ETH_ADDRESS = '0x0000000000000000000000000000000000000000'
const getTokens = (tokens) => {
    return new web3.utils.BN(
        web3.utils.toWei(tokens.toString(), 'ether')
    )
}

const wait = (seconds) => {
    const milliseconds = seconds * 1000
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const seedExchange = async (callback) => {
    try {

        //Get Accounts
        const accounts = await web3.eth.getAccounts()

        //Get Token
        const token = await Token.deployed()
        console.log(`Token: ${token.address}`)

        //Get Exchange
        const exchange = await Exchange.deployed()
        console.log(`Exchange: ${exchange.address}`)

        //Give Tokens to account[1]
        const sender = accounts[0]
        const receiver = accounts[1]
        let amount = web3.utils.toWei('10000', 'ether')

        await token.transfer(receiver, amount, {from: sender})
        console.log(`Transferred ${amount} tokens from ${sender} to ${receiver}`)

        //Exchange users
        const user1 = accounts[0]
        const user2 = accounts[1]

        //User 1 Deposits Ether
        amount = 1
        await exchange.depositETH({from: user1, value: getTokens(amount)})
        console.log(`Deposited ${amount} ETH from ${user1}`)

        //User 2 Appoves Tokens
        amount = 10000
        await token.approve(exchange.address, getTokens(amount), {from: user2})
        console.log(`Approved ${amount} tokens from ${user2}`)

        //User 2 Deposits Tokens
        await exchange.depositTokens(token.address, getTokens(amount), {from: user2})
        console.log(`Deposited ${amount} tokens from ${user2}`)

        /////////////////////////////////////////////////////
        //Seed a Cancelled Order

        //User 1 makes order to get tokens
        let result
        let orderId
        
        result = await exchange.createOrder(token.address, getTokens(100), ETH_ADDRESS, getTokens(0.1), {from: user1})
        orderId = result.logs[0].args.id
        console.log(`${user1} created order ${orderId}`)

        //User 1 cancels order
        await exchange.cancelOrder(orderId, {from: user1})
        console.log(`${user1} canceled order ${orderId}`)
        
        
        /////////////////////////////////////////////////////
        //Seed Filled Orders

        //User 1 makes order
        result = await exchange.createOrder(token.address, getTokens(100), ETH_ADDRESS, getTokens(0.1), {from: user1})
        orderId = result.logs[0].args.id
        console.log(`${user1} created order ${orderId}`)

        //User 2 fills order
        await exchange.fillOrder(orderId, {from: user2})
        console.log(`${user2} filled order ${orderId}`)

        await wait(1)

        //User 1 makes another order
        result = await exchange.createOrder(token.address, getTokens(50), ETH_ADDRESS, getTokens(0.01), {from: user1})
        orderId = result.logs[0].args.id
        console.log(`${user1} created order ${orderId}`)

        //User 2 fills another order
        await exchange.fillOrder(orderId, {from: user2})
        console.log(`${user2} filled order ${orderId}`)

        await wait(1)

        //User 1 makes final order
        result = await exchange.createOrder(token.address, getTokens(200), ETH_ADDRESS, getTokens(0.15), {from: user1})
        orderId = result.logs[0].args.id
        console.log(`${user1} created order ${orderId}`)

        //User 2 fills final order
        await exchange.fillOrder(orderId, {from: user2})
        console.log(`${user2} filled order ${orderId}`)

        await wait(1)

        /////////////////////////////////////////////////////
        //Seed Open Order

        //User 1 makes 10 orders
        for(let i = 0; i <= 10; i++) {
            result = await exchange.createOrder(token.address, getTokens(10*i), ETH_ADDRESS, getTokens(0.01), {from: user1})
            orderId = result.logs[0].args.id
            console.log(`${user1} created order ${orderId}`)
            await wait(1)
        }

        //User 2 makes 10 orders
        for(let i = 0; i <= 10; i++) {
            result = await exchange.createOrder(ETH_ADDRESS, getTokens(0.01), token.address, getTokens(10*i), {from: user2})
            orderId = result.logs[0].args.id
            console.log(`${user2} created order ${orderId}`)
            await wait(1)
        }

    } catch (error) {
        console.log(error)
    }


    callback()
}

module.exports = seedExchange