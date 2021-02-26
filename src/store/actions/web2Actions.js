export const web3Loaded = (connection) => {
    return {
        type: 'WEB3_LOADED',
        connection
    }
}

export const web3Account = (account) => {
    return {
        type: 'WEB3_ACCOUNT_LOADED',
        account
    }
}
