export const exchangeLoaded = (exchange) => {
    return {
        type: 'EXCHANGE_LOADED',
        exchange
    }
}

export const performingAction = (performing) => {
    return {
        type: 'PERFORMING_ACTION',
        performing
    }
}