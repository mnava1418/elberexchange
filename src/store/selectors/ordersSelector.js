import { get } from 'lodash'
import moment from 'moment'
import { createSelector } from 'reselect'
import { ETH_ADDRESS, fromWei} from '../../utils/ethUtil'
import {account} from './index'

//Filled Orders
export const filledOrdersLoaded = state => get(state, 'exchange.filledOrders.loaded', false)
export const filledOrdersLoadedSelector = createSelector(filledOrdersLoaded, fl => fl)

export const filledOrders = state => get(state, 'exchange.filledOrders.data', [])
export const filledOrdersSelector = createSelector(
    filledOrders,
    (orders) => {
        orders = orders.sort((a,b) => a.timeStamp - b.timeStamp)
        orders = decorateFilledOrders(orders)
        orders = orders.sort((a,b) => b.timeStamp - a.timeStamp)
        return orders
    }
)

//Canceled Orders
const canceledOrdersLoaded = state => get(state, 'exchange.canceledOrders.loaded', false)
export const canceledOrdersLoadedSelector = createSelector(canceledOrdersLoaded, cl => cl)

const canceledOrders = state => get(state, 'exchange.canceledOrders.data', [])
export const canceledOrdersSelector = createSelector(canceledOrders, orders => orders)

//Open Orders
const allOrdersLoaded = state => get(state, 'exchange.allOrders.loaded', false)
export const allOrdersLoadedSelector = createSelector(
    canceledOrdersLoaded,
    filledOrdersLoaded,
    allOrdersLoaded,
    (cl, fl, al) => (cl && fl && al)
)

const allOrders = state => get(state, 'exchange.allOrders.data', [])

const openOrders = state => {
    const all = allOrders(state)
    const filled = filledOrders(state)
    const canceled = canceledOrders(state)
    const openOrders = getOpenOrders(all, filled, canceled)
    return openOrders
}

export const openOrdersSelector = createSelector( openOrders, orders => orders )

export const myTradesSelector = createSelector(
    account,
    filledOrders,
    (account, orders) => {
        let myTrades = orders.filter( (order ) => order.user === account || order.userFill === account)
        myTrades = myTrades.sort((a,b) => b.timeStamp - a.timeStamp)
        myTrades = decorateMyTrades(account, myTrades)
        return myTrades
    }
)

export const myOpenOrdersSelector = createSelector(
    account,
    openOrders,
    (account, orders) => {
        orders['Buy'] = orders['Buy'].filter( (order) => order.user === account)
        orders['Sell'] = orders['Sell'].filter( (order) => order.user === account)
        return orders
    }
)

const cancelingOrder = state => get(state, 'exchange.cancelingOrder', false)
export const cancelingOrderSelector = createSelector(cancelingOrder, p => p)

const fillingOrder = state => get(state, 'exchange.fillingOrder', false)
export const fillingOrderSelector = createSelector(fillingOrder, p => p)

/*----
HELPER FUNCTIONS
----*/
const getOpenOrders = (allOrders, filledOrders, canceledOrders) => {
    const filledMap = getOrderMap(filledOrders)
    const canceledMap = getOrderMap(canceledOrders)
    
    let openOrders = allOrders.filter( (order) => (!filledMap[order.id] && !canceledMap[order.id]) )
    openOrders = openOrders.sort((a, b) => b.timeStamp - a.timeStamp)
    openOrders = decorateOpenOrders(openOrders)
    
    const openOrdersByType = getOrdersByType(openOrders, ['Buy', 'Sell'])
    return openOrdersByType
}


const getOrderMap = (orders = []) => {
    let orderMap = {}
    orders.forEach( (order) => {
        orderMap[order.id] = order
    } )

    return orderMap
}

const getOrdersByType = (orders, types) => {
    let ordersByType = {}
    types.forEach( (type ) => {
        ordersByType[type] = orders.filter( (order) => (order.orderType === type))
    } )

    return ordersByType
}

const decorateOpenOrders = (orders) => {
    orders = orders.map( (order) => {
        order = decorateOrder(order)
        order = decorateOpenOrder(order)
        return order
    })
    return orders
}

export const decorateFilledOrders = (orders) => {
    let previousOrder = orders[0]
    orders = orders.map((order) => {
        order = decorateOrder(order)
        order = decorateFilledOrder(order, previousOrder)
        previousOrder = order
        return order
    })

    return orders
}

const decorateMyTrades = (account, orders) => {
    orders = orders.map((order) => {
        order = decorateOrder(order)
        order = decorateMyTrade(account, order)
        return order
    })

    return orders
}

const decorateOrder = (order) => {
    let ethAmount
    let tokenAmount

    if(order.tokenGive === ETH_ADDRESS) {
        ethAmount = order.amountGive
        tokenAmount = order.amountGet
    } else {
        ethAmount = order.amountGet
        tokenAmount = order.amountGive
    }

    const precision = 100000
    let tokenPrice = (ethAmount / tokenAmount)
    tokenPrice = Math.round(tokenPrice * precision) / precision
    
    return ({
        ...order,
        ethAmount: fromWei(ethAmount),
        tokenAmount: fromWei(tokenAmount),
        tokenPrice,
        formattedTimestamp: moment.unix(order.timeStamp).format('h:mm:ss a M/D')
    })
}

const decorateFilledOrder = (order, previousOrder) => {
    let tokenPriceClass

    if(order.id === previousOrder.id || previousOrder.tokenPrice <= order.tokenPrice) {
        tokenPriceClass = 'success'
    } else {
        tokenPriceClass = 'danger'
    }

    return ({
        ...order,
        tokenPriceClass
    })
}

const decorateOpenOrder = (order) => {
    let orderType
    let orderTypeClass

    if(order.tokenGive === ETH_ADDRESS) {
        orderType = 'Buy'
        orderTypeClass = 'success'
    } else {
        orderType = 'Sell'
        orderTypeClass = 'danger'
    }

    return ({
        ...order,
        orderType,
        orderTypeClass
    })
}

const decorateMyTrade = (account, order) => {
    let tradeTypeClass
    let tradeSign
    if(order.user === account) {
        if(order.tokenGive === ETH_ADDRESS) {
            tradeTypeClass = 'success'
            tradeSign = '+'
        } else {
            tradeTypeClass = 'danger'
            tradeSign = '-'
        }
    } else {
        if(order.tokenGive === ETH_ADDRESS) {
            tradeTypeClass = 'danger'
            tradeSign = '-'
        } else {
            tradeTypeClass = 'success'
            tradeSign = '+'
        }
    }

    return ({
        ...order,
        tradeTypeClass,
        tradeSign
    })
}