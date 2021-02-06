const web3 = require('web3')
const eth = new web3(web3.givenProvider).eth;
const Exchange = artifacts.require('./Exchange')
const Token = artifacts.require('./Token')

const EVM_ERROR = 'VM Exception while processing transaction: revert'
const ETH = '0x0000000000000000000000000000000000000000'
const getTokens = (tokens) => {
    return new web3.utils.BN(
        web3.utils.toWei(tokens.toString(), 'ether')
    )
}

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Exchange', ([deployer, feeAccount, user1]) => {
    let token
    let exchange
    const feePercent = 10
    const totalTokenAmount = getTokens(100)

    beforeEach(async () => {
        token = await Token.new()
        await token.transfer(user1, totalTokenAmount, {from: deployer})
        exchange = await Exchange.new(feeAccount, feePercent)
    })

    describe('deployment', () => {
        it('tracks the feeAccount', async () => {
            const result = await exchange.feeAccount()
            result.should.equal(feeAccount)
        })

        it('tracks the feePercent', async () => {
            const result = await exchange.feePercent()
            result.toString().should.equal(feePercent.toString())
        })
    })

    describe('deposit Tokens', () => {
        let result
        const amount = getTokens(10)

        describe('success', () => {

            beforeEach(async () => {
                await token.approve(exchange.address, amount, {from: user1})
                result = await exchange.depositTokens(token.address, amount, {from: user1})
            })

            it('tracks the deposit', async () => {
                const exchangeBalance = await token.balanceOf(exchange.address)
                const userBalance = await token.balanceOf(user1)

                exchangeBalance.toString().should.equal(amount.toString())
                userBalance.toString().should.equal(getTokens(90).toString()) 
                
                const tokenBalance = await exchange.tokens(token.address, user1)
                tokenBalance.toString().should.equal(amount.toString())
            })

            it('emit deposit event', async () => {
                const log = result.logs[0]
                const event = log.args

                log.event.should.equal('Deposit')
                event._token.should.equal(token.address)
                event._user.should.equal(user1)
                event._amount.toString().should.equal(amount.toString())
                event._balance.toString().should.equal(amount.toString())
            })
        })

        describe('failure', () => {
            it('deposit not approved tokens', async () => {
                await exchange.depositTokens(token.address, amount, {from: user1}).should.be.rejectedWith(EVM_ERROR)
            })
        } )
    })

    describe('deposit ETH', async () => {
        
        describe('success', () => {
            let result
            const amount = getTokens(1)

            beforeEach(async () => {
                result = await exchange.depositETH({from: user1, value: amount})
            })

            it('tracks the deposit', async () => {
                const balance = await exchange.tokens(ETH, user1)
                balance.toString().should.equal(amount.toString())

                const exchaneETHBalance = await eth.getBalance(exchange.address)
                exchaneETHBalance.toString().should.equal(amount.toString())
            })

            it('emit deposit event', async () => {
                const log = result.logs[0]
                const event = log.args

                log.event.should.equal('Deposit')
                event._token.should.equal(ETH)
                event._user.should.equal(user1)
                event._amount.toString().should.equal(amount.toString())
                event._balance.toString().should.equal(amount.toString())
            })
        })

        describe('failure', () => {
            it('deposit eth not available', async () => {
                await await exchange.depositETH({from: user1, value: getTokens(1000)}).should.be.rejected
            })
        } )
    })

    describe('fallback', async () => {
        it('revert when ETH is sent', async () => {
            await exchange.sendTransaction({value: getTokens(80), from: user1}).should.be.rejected
        })
    })
})