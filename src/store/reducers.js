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

const wallet = (state = {}, action) => {
    switch (action.type) {
        case 'WALLET_ETH_BALANCE_LOADED':
            return {...state, ethBalance: action.ethBalance, ethBalanceLoaded: true}
        case 'WALLET_TOKEN_BALANCE_LOADED':
                return {...state, tokenBalance: action.tokenBalance, tokenBalanceLoaded: true}
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
        case 'CANCELING_ORDER':
            return {...state, cancelingOrder: true}
        case 'CANCEL_ORDER': {
            return { 
                ...state, 
                canceledOrders: {
                    loaded: true, 
                    data: [
                        ...state.canceledOrders.data,
                        action.orderCanceled
                    ]
                }, 
                cancelingOrder: false 
            }
        }
        case 'FILLING_ORDER':
            return {...state, fillingOrder: true}
        case 'FILL_ORDER': {
            return { 
                ...state, 
                filledOrders: {
                    loaded: true, 
                    data: [
                        ...state.filledOrders.data,
                        action.orderFilled
                    ]
                }, 
                fillingOrder: false 
            }
        }
        default:
            return state
    }
}

const rootReducer = combineReducers({
    web3,
    token,
    exchange,
    wallet
})

export default rootReducer