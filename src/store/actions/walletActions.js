export const ethBalanceLoaded = (ethBalance) => {
    return {
        type: 'WALLET_ETH_BALANCE_LOADED',
        ethBalance
    }
}

export const tokenBalanceLoaded = (tokenBalance) => {
    return {
        type: 'WALLET_TOKEN_BALANCE_LOADED',
        tokenBalance
    }
}