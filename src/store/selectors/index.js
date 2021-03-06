import { get } from 'lodash'
import { createSelector } from 'reselect'
import { formatBalance } from '../../utils/ethUtil'

const web3 = state => get(state, 'web3.connection', null)
export const web3Selector = createSelector(web3, w => w)

export const account = state => get(state, 'web3.account', null)
export const accountSelector = createSelector(account, a => a)

const exchange = state => get(state, 'exchange.contract')
export const exchangeSelector = createSelector(exchange, e => e)

const token = state => get(state, 'token.contract')
export const tokenSelector = createSelector(token, t => t)

const tokenLoaded = state => get(state, 'token.loaded', false)
const exchangeLoaded = state => get(state, 'exchange.loaded', false)

export const contractsLoadedSelector = createSelector(
    tokenLoaded,
    exchangeLoaded,
    (tl, el) => (tl && el)
)

const exchangeEthBalance = state => get(state, 'exchange.ethBalance', 0)
export const exchangeEthBalanceSelector = createSelector(
    exchangeEthBalance,
    (balance) => {
        balance = formatBalance(balance)
        return balance
    }
)

const exchangeTokenBalance = state => get(state, 'exchange.tokenBalance', 0)
export const exchangeTokenBalanceSelector = createSelector(
    exchangeTokenBalance,
    (balance) => {
        balance = formatBalance(balance)
        return balance
    }
)

const loadingBalances = state => get(state, 'exchange.loadingBalances', false)
export const loadingBalancesSelector = createSelector(loadingBalances, l => l)