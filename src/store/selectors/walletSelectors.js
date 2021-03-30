import { get } from 'lodash'
import { createSelector } from 'reselect'
import { formatBalance } from '../../utils/ethUtil'

const walletEthBalanceLoaded = state => get(state, 'wallet.ethBalanceLoaded', false)
export const walletEthBalanceLoadedSelector = createSelector(walletEthBalanceLoaded, l => l)

const walletEthBalance = state => get(state, 'wallet.ethBalance', 0)
export const walletEthBalanceSelector = createSelector(
    walletEthBalance,
    (balance) => {
        balance = formatBalance(balance)
        return balance
    }
)

const walletTokenBalanceLoaded = state => get(state, 'wallet.tokenBalanceLoaded', false)
export const walletTokenBalanceLoadedSelector = createSelector(walletTokenBalanceLoaded, l => l)

const walletTokenBalance = state => get(state, 'wallet.tokenBalance', 0)
export const walletTokenBalanceSelector = createSelector(
    walletTokenBalance,
    (balance) => {
        balance = formatBalance(balance)
        return balance
    }
)
