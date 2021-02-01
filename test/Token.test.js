const web3 = require('web3')
const Token = artifacts.require('./Token')

const EVM_ERROR = 'VM Exception while processing transaction: revert'
const getTokens = (tokens) => {
    return new web3.utils.BN(
        web3.utils.toWei(tokens.toString(), 'ether')
    )
}

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Token', ([deployer, receiver]) => {
    let token
    let totalSupply = getTokens(1000000)

    beforeEach(async () => {
        token = await Token.new()
    })

    describe('deployment', () => {
        it('tracks the name', async () => {
            const name = await token.name()
            name.should.equal('Elber Coin')
        })

        it('tracks the symbol', async () => {
            const symbol = await token.symbol()
            symbol.should.equal('ELB')
        })

        it('tracks the decimals', async () => {
            const decimals = await token.decimals()
            decimals.toString().should.equal('18')
        })

        it('tracks the totalSupply', async () => {
            const totalSupply = await token.totalSupply()
            totalSupply.toString().should.equal(totalSupply.toString())
        })

        it('assign totalSupply to deployer', async () => {
            const balanceOf = await token.balanceOf(deployer) //the deployer is always the first account on the blockchain
            balanceOf.toString().should.equal(totalSupply.toString())
        })
    })

    describe('transfer tokens', () => {
        describe('success', () => {
            let amount
            let result

            beforeEach(async () => {
                amount = getTokens(1000)
                result = await token.transfer(receiver, amount, {from: deployer})
            })

            it('transfer tokens to address', async () => {
                const balanceOfDeployer = await token.balanceOf(deployer)
                const balanceOfReceiver = await token.balanceOf(receiver)

                balanceOfDeployer.toString().should.equal(getTokens(999000).toString())
                balanceOfReceiver.toString().should.equal(amount.toString())
            })

            it('emit transfer event', async () => {
                const log = result.logs[0]
                const event = log.args

                log.event.should.equal('Transfer')
                event.from.should.equal(deployer)
                event.to.should.equal(receiver)
                event.value.toString().should.equal(amount.toString())
            })
        } )

        describe('failure', () => {
            it('transfer tokens invalid amount', async () => {
                await token.transfer(receiver, getTokens(10000000), {from: deployer}).should.be.rejectedWith(EVM_ERROR)
                await token.transfer(deployer, getTokens(1), {from: receiver}).should.be.rejectedWith(EVM_ERROR)
            })

            it('transfer tokens to invalid account', async () => {
                await token.transfer(0x0, getTokens(100), {from: deployer}).should.be.rejected
            })
        } )
    })
})