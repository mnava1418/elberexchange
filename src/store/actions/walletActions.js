export const loadEthBalance = (ethBalance) => {
    return {
        type: 'LOAD_WALLET_ETH_BALANCE',
        ethBalance
    }
}

export const loadTokenBalance = (tokenBalance) => {
    return {
        type: 'LOAD_WALLET_TOKEN_BALANCE',
        tokenBalance
    }
}