import { get } from 'lodash'
import { createSelector } from 'reselect'

export const account = state => get(state, 'web3.account', null)
export const accountSelector = createSelector(account, a => a)

const exchange = state => get(state, 'exchange.contract')
export const exchangeSelector = createSelector(exchange, e => e)

const tokenLoaded = state => get(state, 'token.loaded', false)
const exchangeLoaded = state => get(state, 'exchange.loaded', false)

export const contractsLoadedSelector = createSelector(
    tokenLoaded,
    exchangeLoaded,
    (tl, el) => (tl && el)
)
