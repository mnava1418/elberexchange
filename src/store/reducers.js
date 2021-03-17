import { combineReducers} from 'redux'

const web3 = (state = {}, action) => {
    switch (action.type) {
        case 'WEB3_LOADED':
            return { ...state, connection: action.connection}
        case 'WEB3_ACCOUNT_LOADED':
            return { ...state, account: action.account}
        default:
            return state
    }
}

const token = (state = {}, action) => {
    switch (action.type) {
        case 'TOKEN_LOADED':
            return { ...state, loaded: true, contract: action.token}
        default:
            return state
    }
}

const exchange = (state = {}, action) => {
    switch (action.type) {
        case 'EXCHANGE_LOADED':
            return { ...state, loaded: true, contract: action.exchange}
        case 'CANCELED_ORDERS_LOADED':
            return { ...state, canceledOrders: {loaded: true, data: action.canceledOrders} }
        case 'FILLED_ORDERS_LOADED':
            return { ...state, filledOrders: {loaded: true, data: action.filledOrders} }
        case 'ALL_ORDERS_LOADED':
            return { ...state, allOrders: {loaded: true, data: action.allOrders} }
        case 'PERFORMING_ACTION':
            return {...state, performing: action.performing}
        case 'CANCEL_ORDER': {
            let currentCanceledOrders = state.canceledOrders.data
            currentCanceledOrders.push(action.order)
            return { ...state, canceledOrders: {loaded: true, data: currentCanceledOrders} }
        }
        default:
            return state
    }
}

const rootReducer = combineReducers({
    web3,
    token,
    exchange
})

export default rootReducer