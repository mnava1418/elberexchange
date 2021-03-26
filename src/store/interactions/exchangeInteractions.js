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

import { exchangeLoaded } from '../actions/exchangeActions'

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