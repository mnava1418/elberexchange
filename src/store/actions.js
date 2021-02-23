export function web3Loaded(connection) {
    return {
        type: 'WEB3_LOADED',
        connection
    }
}

export function web3Account(account) {
    return {
        type: 'WEB3_ACCOUNT_LOADED',
        account
    }
}

export function tokenLoaded(token) {
    return {
        type: 'TOKEN_LOADED',
        token
    }
}

export function exchangeLoaded(exchange) {
    return {
        type: 'EXCHANGE_LOADED',
        exchange
    }
}

export function cancelOrdersLoaded(canceledOrders) {
    return {
        type: 'CANCELED_ORDERS_LOADED',
        canceledOrders
    }
}

export function filledOrdersLoaded(filledOrders) {
    return {
        type: 'FILLED_ORDERS_LOADED',
        filledOrders
    }
}

export function allOrdersLoaded(allOrders) {
    return {
        type: 'ALL_ORDERS_LOADED',
        allOrders
    }
}