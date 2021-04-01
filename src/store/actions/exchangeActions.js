export const exchangeLoaded = (exchange) => {
    return {
        type: 'EXCHANGE_LOADED',
        exchange
    }
}

export const exchangeLoadETHBalance = (ethBalance) => {
    return {
        type: 'LOAD_EXCHANGE_ETH_BALANCE',
        ethBalance
    }
}

export const exchangeLoadTokenBalance = (tokenBalance) => {
    return {
        type: 'LOAD_EXCHANGE_TOKEN_BALANCE',
        tokenBalance
    }
}

export const loadingBalances = (loadingBalances) => {
    return {
        type: "LOADING_BALANCES",
        loadingBalances
    }
}