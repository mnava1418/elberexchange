import Exchange from '../../abis/Exchange.json'
import { 
    allOrdersLoaded, 
    cancelOrdersLoaded, 
    filledOrdersLoaded,
    cancelingOrder,
    fillingOrder,
    creatingOrder,
    orderCreated,
    orderCanceled,
    orderFilled
} from '../actions/ordersActions'

import { exchangeLoaded, exchangeLoadETHBalance, exchangeLoadTokenBalance, loadingBalances } from '../actions/exchangeActions'
import { walletLoadEthBalance, walletLoadTokenBalance } from '../actions/walletActions'
import { ETH_ADDRESS, getDepositBalances, getWithdrawBalances } from '../../utils/ethUtil'
import { loadWalletBalances } from '../interactions/walletInteractions'

let processedOrders = {}
let processedCanceled = {}
let processedFilled = {}

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

export const subscribeToEvents = (exchange, web3, account, token, dispatch) => {
    exchange.events.Cancel()
    .on('data', async (event) => {
        if(processedCanceled[event.returnValues.id] === undefined) {
            dispatch(orderCanceled(event.returnValues))
            processedCanceled[event.returnValues.id] = event.returnValues
        }
    })

    exchange.events.Trade()
    .on('data', async (event) => {
        if(processedFilled[event.returnValues.id] === undefined) {
            dispatch(orderFilled(event.returnValues))
            processedFilled[event.returnValues.id] = event.returnValues

            if(event.returnValues.user === account || event.returnValues.userFill === account) {
                await loadWalletBalances(web3, account, token, dispatch)
                await loadExchangeBalances(account, exchange, token, dispatch)
            }
        }
    })

    exchange.events.Deposit()
    .on('data', (event) => {
        dispatch(loadingBalances(false))
    })

    exchange.events.WithDraw()
    .on('data', (event) => {
        dispatch(loadingBalances(false))
    })

    exchange.events.Order()
    .on('data', (event) => {
        if(processedOrders[event.returnValues.id] === undefined) {
            dispatch(orderCreated(event.returnValues))
            processedOrders[event.returnValues.id] = event.returnValues
        }
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

export const createOrder = (web3, exchange, account, tokenGet, amountGet, tokenGive, amountGive, dispatch) => {
    amountGet = web3.utils.toWei(amountGet, 'ether')
    amountGive = web3.utils.toWei(amountGive, 'ether')


    exchange.methods.createOrder(tokenGet, amountGet, tokenGive, amountGive).send({from: account})
    .on('transactionHash', (hash) => {
       dispatch(creatingOrder())
    })
    .on('error', (err) => {
        console.error(err)
        window.alert(err.message)
    });
}

export const loadExchangeBalances = async (account, exchange, token, dispatch) => {   
    const ethBalance = await exchange.methods.checkBalance(ETH_ADDRESS, account).call()
    dispatch(exchangeLoadETHBalance(ethBalance))

    const tokenBalance = await exchange.methods.checkBalance(token._address, account).call()
    dispatch(exchangeLoadTokenBalance(tokenBalance))
}

export const depositETH = (web3, exchange, account, walletBalance, exchangeBalance, depositAmount, dispatch) => {
    const depositBalances = getDepositBalances(web3, exchangeBalance, walletBalance, depositAmount)
    
    exchange.methods.depositETH().send({from: account, value: web3.utils.toWei(depositAmount, 'ether')})
    .on('transactionHash', (hash) => {
        dispatch(loadingBalances(true))
        dispatch(exchangeLoadETHBalance(depositBalances.newExchangeBalance))
        dispatch(walletLoadEthBalance(depositBalances.newWalletBalance))
    })
    .on('error', (err) => {
        console.error(err)
        window.alert(err.message)
    });
}

export const depositToken = (web3, exchange, token, account, walletBalance, exchangeBalance, depositAmount, dispatch) => {
    const depositBalances = getDepositBalances(web3, exchangeBalance, walletBalance, depositAmount)
    depositAmount = web3.utils.toWei(depositAmount, 'ether')

    token.methods.approve(exchange._address, depositAmount).send({from: account})
    .on('transactionHash', (hash) => {
        exchange.methods.depositTokens(token._address, depositAmount).send({from: account})
        .on('transactionHash', (hash) => {
            dispatch(loadingBalances(true))
            dispatch(exchangeLoadTokenBalance(depositBalances.newExchangeBalance))
            dispatch(walletLoadTokenBalance(depositBalances.newWalletBalance))
        })
        .on('error', (err) => {
            console.error(err)
            window.alert(err.message)
        });
    })
}

export const withdrawETH = (web3, exchange, account, walletBalance, exchangeBalance, withdrawAmount, dispatch) => {
    const withdrawBalances = getWithdrawBalances(web3, exchangeBalance, walletBalance, withdrawAmount)
    
    exchange.methods.withdrawETH(web3.utils.toWei(withdrawAmount, 'ether')).send({from: account})
    .on('transactionHash', (hash) => {
        dispatch(loadingBalances(true))
        dispatch(exchangeLoadETHBalance(withdrawBalances.newExchangeBalance))
        dispatch(walletLoadEthBalance(withdrawBalances.newWalletBalance))
    })
    .on('error', (err) => {
        console.error(err)
        window.alert(err.message)
    });
}

export const withdrawToken = (web3, exchange, token, account, walletBalance, exchangeBalance, withdrawAmount, dispatch) => {
    const withdrawBalances = getWithdrawBalances(web3, exchangeBalance, walletBalance, withdrawAmount)
    withdrawAmount = web3.utils.toWei(withdrawAmount, 'ether')

    exchange.methods.withdrawTokens(token._address, withdrawAmount).send({from: account})
    .on('transactionHash', (hash) => {
        dispatch(loadingBalances(true))
        dispatch(exchangeLoadTokenBalance(withdrawBalances.newExchangeBalance))
        dispatch(walletLoadTokenBalance(withdrawBalances.newWalletBalance))
    })
    .on('error', (err) => {
        console.error(err)
        window.alert(err.message)
    });
}