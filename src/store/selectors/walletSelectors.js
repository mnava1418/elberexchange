import { get } from 'lodash'
import { createSelector } from 'reselect'
import { formatBalance } from '../../utils/ethUtil'

const walletEthBalance = state => get(state, 'wallet.ethBalance', 0)
export const walletEthBalanceSelector = createSelector(
    walletEthBalance,
    (balance) => {
        balance = formatBalance(balance)
        return balance
    }
)

const walletTokenBalance = state => get(state, 'wallet.tokenBalance', 0)
export const walletTokenBalanceSelector = createSelector(
    walletTokenBalance,
    (balance) => {
        balance = formatBalance(balance)
        return balance
    }
)
