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

export const cancelingOrder = () => {
    return {
        type: 'CANCELING_ORDER',
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

export const orderCreated = (order) => {
    return {
        type: 'ORDER_CREATED',
        order
    }
}

export const orderCanceled = (order) => {
    return {
        type: 'ORDER_CANCELED',
        order
    }
}

export const orderFilled = (order) => {
    return {
        type: 'ORDER_FILLED',
        order
    }
}
