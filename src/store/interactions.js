import Web3 from 'web3'
import Token from  '../abis/Token.json'
import Exchange from '../abis/Exchange.json'
import {
    web3Loaded,
    web3Account,  
    tokenLoaded,
    exchangeLoaded,
} from './actions'

export function loadWeb3 (dispatch) {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545')
    dispatch(web3Loaded(web3))
    return web3
}

export async function loadAccount(web3, dispatch) {
    const accounts = await web3.eth.getAccounts()
    if (accounts.length > 0) {
        dispatch(web3Account(accounts[0]))
    } else {
        window.alert('Account not connected. Connect via Metamask')
    }
}

export async function loadToken(web3, dispatch) {
    const networkId = await web3.eth.net.getId()
    const networks = Token.networks
    
    if(networks[networkId] === undefined) {
        window.alert('ELB Token not found in current network. Update via Metamask')
    } else {
        const address = networks[networkId].address
        const abi = Token.abi
        const token = new web3.eth.Contract(abi, address)
        dispatch(tokenLoaded(token))
        return token
    }
}

export async function loadExchange(web3, dispatch) {
    const networkId = await web3.eth.net.getId()
    const networks = Exchange.networks
    
    if(networks[networkId] === undefined) {
        window.alert('Exchange not found in current network. Update via Metamask')
    } else {
        const address = networks[networkId].address
        const abi = Exchange.abi
        const exchange = new web3.eth.Contract(abi, address)
        dispatch(exchangeLoaded(exchange))
        return exchange
    }
}