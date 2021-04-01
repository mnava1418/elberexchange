import { walletLoadEthBalance, walletLoadTokenBalance } from '../actions/walletActions'

export const loadWalletBalances = async (web3, account, token, dispatch) => {
    const ethBalance = await web3.eth.getBalance(account)
    dispatch(walletLoadEthBalance(ethBalance))

    const tokenBalance = await token.methods.balanceOf(account).call()
    dispatch(walletLoadTokenBalance(tokenBalance))
}