import Web3 from 'web3'
import { web3Loaded, web3Account} from '../actions/web3Actions'

export const loadWeb3 = (dispatch) => {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545')
    dispatch(web3Loaded(web3))
    return web3
}

export const loadAccount = async (web3, dispatch) => {
    const accounts = await web3.eth.getAccounts()

    if (accounts.length > 0) {
        dispatch(web3Account(accounts[0]))
        return accounts[0]
    } else {
        return null
    }
}