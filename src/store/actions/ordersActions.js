export const cancelOrdersLoaded = (canceledOrders) => {
    return {
        type: 'CANCELED_ORDERS_LOADED',
        canceledOrders
    }
}

export const filledOrdersLoaded = (filledOrders) => {
    return {
        type: 'FILLED_ORDERS_LOADED',
        filledOrders
    }
}

export const allOrdersLoaded = (allOrders) => {
    return {
        type: 'ALL_ORDERS_LOADED',
        allOrders
    }
}