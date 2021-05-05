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

export const cancelOrderAction = (orderCanceled) => {
    return {
        type: 'CANCEL_ORDER',
        orderCanceled
    }
}

export const cancelingOrder = () => {
    return {
        type: 'CANCELING_ORDER',
    }
}

export const fillOrderAction = (orderFilled) => {
    return {
        type: 'FILL_ORDER',
        orderFilled
    }
}

export const fillingOrder = () => {
    return {
        type: "FILLING_ORDER",
    }
}

export const creatingOrder = () => {
    return {
        type: "CREATING_ORDER"
    }
}
