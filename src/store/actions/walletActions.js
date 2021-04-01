export const walletLoadEthBalance = (ethBalance) => {
    return {
        type: 'LOAD_WALLET_ETH_BALANCE',
        ethBalance
    }
}

export const walletLoadTokenBalance = (tokenBalance) => {
    return {
        type: 'LOAD_WALLET_TOKEN_BALANCE',
        tokenBalance
    }
}