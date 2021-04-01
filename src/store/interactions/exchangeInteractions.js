import Exchange from '../../abis/Exchange.json'
import { 
    allOrdersLoaded, 
    cancelOrdersLoaded, 
    cancelOrderAction,
    filledOrdersLoaded,
    cancelingOrder,
    fillingOrder,
    fillOrderAction
} from '../actions/ordersActions'

import { exchangeLoaded, loadETHBalance, loadTokenBalance } from '../actions/exchangeActions'
import { ETH_ADDRESS } from '../../utils/ethUtil'

export const loadExchange = async (web3, dispatch) => {
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

export const loadOrders = async (exchange, dispatch) => {
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

export const subscribeToEvents = (exchange, dispatch) => {
    exchange.events.Cancel()
    .on('data', (event) => {
        dispatch(cancelOrderAction(event.returnValues))
    })

    exchange.events.Trade()
    .on('data', (event) => {
        dispatch(fillOrderAction(event.returnValues))
    })
}

export const cancelOrder = (exchange, orderId, account, dispatch) => {
    exchange.methods.cancelOrder(orderId).send({from: account})
    .on('transactionHash', (hash) => {
        dispatch(cancelingOrder())
    })
    .on('error', (err) => {
        console.error(err)
        window.alert(err.message)
    });   
}

export const fillOrder = (exchange, orderId, account, dispatch) => {
    exchange.methods.fillOrder(orderId).send({from: account})
    .on('transactionHash', (hash) => {
        dispatch(fillingOrder())
    })
    .on('error', (err) => {
        console.error(err)
        window.alert(err.message)
    });   
}

export const loadExchangeBalances = async (account, exchange, token, dispatch) => {   
    const ethBalance = await exchange.methods.checkBalance(ETH_ADDRESS, account).call()
    dispatch(loadETHBalance(ethBalance))

    const tokenBalance = await exchange.methods.checkBalance(token._address, account).call()
    dispatch(loadTokenBalance(tokenBalance))
}

export const depositETH = (web3, walletBalance, exchangeBalance, depositAmount, dispatch) => {
    /*let newExchangeBalance = parseFloat(exchangeBalance) + parseFloat(depositAmount)
    newExchangeBalance = web3.utils.toWei(newExchangeBalance.toString(), 'ether')
    exchangeBalance = web3.utils.toWei(exchangeBalance.toString(), 'ether')

    let newWalletBalance = parseFloat(walletBalance) - parseFloat(depositAmount)
    newWalletBalance = web3.utils.toWei(newWalletBalance.toString(), 'ether')
    walletBalance = web3.utils.toWei(walletBalance.toString(), 'ether')

    dispatch(ethBalanceLoaded(newExchangeBalance))*/
}