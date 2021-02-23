import Web3 from 'web3'
import Token from  '../abis/Token.json'
import Exchange from '../abis/Exchange.json'
import {
    web3Loaded,
    web3Account,  
    tokenLoaded,
    exchangeLoaded,
    cancelOrdersLoaded,
    filledOrdersLoaded,
    allOrdersLoaded
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
        return accounts[0]
    } else {
        return null
    }
}

export async function loadToken(web3, dispatch) {
    const networkId = await web3.eth.net.getId()
    const networks = Token.networks
    
    if(networks[networkId] === undefined) {
        return null
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
        return null
    } else {
        const address = networks[networkId].address
        const abi = Exchange.abi
        const exchange = new web3.eth.Contract(abi, address)
        dispatch(exchangeLoaded(exchange))
        return exchange
    }
}

export async function loadOrders(exchange, dispatch) {
    const canceledOrdersEvents = await exchange.getPastEvents('Cancel', {fromBlock: 0, toBlock: 'latest'})
    const cancelOrders = canceledOrdersEvents.map( event => event.returnValues)
    dispatch(cancelOrdersLoaded(cancelOrders))

    const filledOrdersEvents = await exchange.getPastEvents('Trade', {fromBlock: 0, toBlock: 'latest'})
    const filledOrders = filledOrdersEvents.map( event => event.returnValues)
    dispatch(filledOrdersLoaded(filledOrders))

    const allOrdersEvents = await exchange.getPastEvents('Order', {fromBlock: 0, toBlock: 'latest'})
    const allOrders = allOrdersEvents.map( event => event.returnValues)
    dispatch(allOrdersLoaded(allOrders))
}