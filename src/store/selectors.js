import { get } from 'lodash'
import { createSelector } from 'reselect'
import { ETH_ADDRESS, fromWei} from '../utils/ethUtil'
import moment from 'moment'

const account = state => get(state, 'web3.account')
export const accountSelector = createSelector(account, a => a)

const exchange = state => get(state, 'exchange.contract')
export const exchangeSelector = createSelector(exchange, e => e)

const tokenLoaded = state => get(state, 'token.loaded', false)
export const tokenLoadedSelector = createSelector(tokenLoaded, tl => tl)

const exchangeLoaded = state => get(state, 'exchange.loaded', false)
export const exchangeLoadedSelector = createSelector(exchangeLoaded, el => el)

export const contractsLoadedSelector = createSelector(
    tokenLoaded,
    exchangeLoaded,
    (tl, el) => (tl && el)
)

const filledOrdersLoaded = state => get(state, 'exchange.filledOrders.loaded', false)
export const filledOrdersLoadedSelector = createSelector(filledOrdersLoaded, fl => fl)

const filledOrders = state => get(state, 'exchange.filledOrders.data', [])
export const filledOrdersSelector = createSelector(
    filledOrders,
    (orders) => {
        orders = orders.sort((a,b) => a.timeStamp - b.timeStamp)
        orders = decorateFilledOrders(orders)
        orders = orders.sort((a,b) => b.timeStamp - a.timeStamp)
        return orders
    }
)

const decorateFilledOrders = (orders) => {
    let previousOrder = orders[0]
    orders = orders.map((order) => {
        order = decorateOrder(order)
        order = decorateFilledOrder(order, previousOrder)
        previousOrder = order
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