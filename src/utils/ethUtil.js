const DECIMALS = (10**18)
export const ETH_ADDRESS = '0x0000000000000000000000000000000000000000'

export const fromWei = (amount) => {
    return (amount/DECIMALS)
}

export const formatBalance = (balance) => {
    const precision = 100  //2 decimal places
    balance = fromWei(balance)
    balance = Math.round(balance * precision) / precision
    return balance
}

export const getDepositBalances = (web3, exchangeBalance, walletBalance, depositAmount) => {
    let newExchangeBalance = parseFloat(exchangeBalance) + parseFloat(depositAmount)
    newExchangeBalance = web3.utils.toWei(newExchangeBalance.toString(), 'ether')
    
    let newWalletBalance = parseFloat(walletBalance) - parseFloat(depositAmount)
    newWalletBalance = web3.utils.toWei(newWalletBalance.toString(), 'ether')

    const depositBalances = { newExchangeBalance, newWalletBalance}
    return depositBalances
}