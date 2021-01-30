const { result } = require("lodash")
const _deploy_contracts = require("../migrations/2_deploy_contracts")

/* eslint-disable no-undef */
const Token = artifacts.require('./Token')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Token', (accounts) => {
    let token 

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
            totalSupply.toString().should.equal('1000000000000000000000000')
        })
    })
})