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
                await exchange.depositETH({from: user1, value: getTokens(1000)}).should.be.rejected
            })
        } )
    })

    describe('fallback', async () => {
        it('revert when ETH is sent', async () => {
            await exchange.sendTransaction({value: getTokens(80), from: user1}).should.be.rejected
        })
    })

    describe('withdraw ETH', async () => {
        let result
        const amount = getTokens(1)
        
        beforeEach(async () => {
            await exchange.depositETH({from: user1, value: amount})
            result = await exchange.withdrawETH(amount,{from: user1})
        })

        describe('success', () => {

            it('tracks the withdraw', async () => {
                const balance = await exchange.tokens(ETH, user1)
                balance.toString().should.equal(getTokens(0).toString())

                const exchaneETHBalance = await eth.getBalance(exchange.address)
                exchaneETHBalance.toString().should.equal(getTokens(0).toString())
            })

            it('emit withdraw event', async () => {
                const log = result.logs[0]
                const event = log.args

                log.event.should.equal('WithDraw')
                event._token.should.equal(ETH)
                event._user.should.equal(user1)
                event._amount.toString().should.equal(amount.toString())
                event._balance.toString().should.equal(getTokens(0).toString())
            })
        })

        describe('failure', () => {
            it('withdraw eth not available', async () => {
                await exchange.withdrawETH(getTokens(100),{from: user1}).should.be.rejected
            })
        } )
    })

    describe('withdraw Tokens', () => {
        let result
        const amount = getTokens(10)

        describe('success', () => {

            beforeEach(async () => {
                await token.approve(exchange.address, amount, {from: user1})
                await exchange.depositTokens(token.address, amount, {from: user1})
                result = await exchange.withdrawTokens(token.address, amount, {from: user1})
            })

            it('tracks the withdraw', async () => {
                const exchangeBalance = await token.balanceOf(exchange.address)
                const userBalance = await token.balanceOf(user1)

                exchangeBalance.toString().should.equal(getTokens(0).toString())
                userBalance.toString().should.equal(getTokens(100).toString()) 
                
                const tokenBalance = await exchange.tokens(token.address, user1)
                tokenBalance.toString().should.equal(getTokens(0).toString())
            })

            it('emit withdraw event', async () => {
                const log = result.logs[0]
                const event = log.args

                log.event.should.equal('WithDraw')
                event._token.should.equal(token.address)
                event._user.should.equal(user1)
                event._amount.toString().should.equal(amount.toString())
                event._balance.toString().should.equal(getTokens(0).toString())
            })
        })

        describe('failure', () => {
            it('withdraw token not available', async () => {
                await exchange.withdrawTokens(getTokens(100),{from: user1}).should.be.rejected
            })
        } )
    })

    describe('check Balance', () => {

        const tokenAmount = getTokens(10)
        const ethAmount = getTokens(1)

        beforeEach(async () => {
            await token.approve(exchange.address, tokenAmount, {from: user1})
            await exchange.depositTokens(token.address, tokenAmount, {from: user1})
            await exchange.depositETH({from: user1, value: ethAmount})
        })

        it('check token balance', async () => {
            const balance = await exchange.checkBalance(token.address, user1, {from: user1})
            balance.toString().should.equal(tokenAmount.toString())
        })

        it('check eth balance', async () => {
            const balance = await exchange.checkBalance(ETH, user1, {from: user1})
            balance.toString().should.equal(ethAmount.toString())
        })
    })

    describe('order actions', () => {
        let result
        beforeEach( async()=> {
            result = await exchange.createOrder(token.address, getTokens(1), ETH, getTokens(1), {from: user1})
        })

        describe('create order', () => {
            it('track create order', async () => {
                const orderCount = await exchange.orderCount()
                orderCount.toString().should.equal('1')
            })

            it('emit Order event', async () => {
                const log = result.logs[0]
                const event = log.args

                log.event.should.equal('Order')
                event.id.toString().should.equal('1')
                event.user.should.equal(user1)
                event.tokenGet.should.equal(token.address)
                event.amountGet.toString().should.equal(getTokens(1).toString())
                event.tokenGive.should.equal(ETH)
                event.amountGive.toString().should.equal(getTokens(1).toString())
            })
        })

        describe('cancel order', () => {
            describe('success', async() => {
                let result
                beforeEach(async() => {
                    await exchange.createOrder(token.address, getTokens(1), ETH, getTokens(1), {from: user1})
                    result = await exchange.cancelOrder(1, {from: user1})
                })

                it('track cancel order', async() => {
                    const cancel = await exchange.canceledOrders(1)
                    cancel.toString().should.equal('true')
                } )

                it('emit Cancel event', async () => {
                    const log = result.logs[0]
                    const event = log.args
    
                    log.event.should.equal('Cancel')
                    event.id.toString().should.equal('1')
                    event.user.should.equal(user1)
                    event.tokenGet.should.equal(token.address)
                    event.amountGet.toString().should.equal(getTokens(1).toString())
                    event.tokenGive.should.equal(ETH)
                    event.amountGive.toString().should.equal(getTokens(1).toString())
                })
            })

            describe('failure', async() => {
                beforeEach(async() => {
                    await exchange.createOrder(token.address, getTokens(1), ETH, getTokens(1), {from: user1})
                })

                it('invalid user', async() => {
                    await exchange.cancelOrder(1, {from: deployer}).should.be.rejected
                } )

                it('invalid id', async() => {
                    await exchange.cancelOrder(999, {from: user1}).should.be.rejected
                } )
            })
        })
    })
})