export const exchangeLoaded = (exchange) => {
    return {
        type: 'EXCHANGE_LOADED',
        exchange
    }
}

export const ethBalanceLoaded = (ethBalance) => {
    return {
        type: 'EXCHANGE_ETH_BALANCE_LOADED',
        ethBalance
    }
}

export const tokenBalanceLoaded = (tokenBalance) => {
    return {
        type: 'EXCHANGE_TOKEN_BALANCE_LOADED',
        tokenBalance
    }
}