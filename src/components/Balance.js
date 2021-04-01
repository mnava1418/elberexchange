import React from 'react'
import Spinner from './Spinner'
import { Tabs, Tab } from 'react-bootstrap'
import { connect } from 'react-redux'
import { loadingBalances } from '../store/actions/exchangeActions'
import { loadWalletBalances } from '../store/interactions/walletInteractions'
import { 
    loadExchangeBalances,
    depositETH,
    depositToken,
    withdrawETH,
    withdrawToken
} from '../store/interactions/exchangeInteractions'
import { 
    web3Selector, 
    accountSelector, 
    tokenSelector,
    exchangeSelector,
    exchangeEthBalanceSelector,
    exchangeTokenBalanceSelector,
    loadingBalancesSelector
} from '../store/selectors'

import { 
    walletEthBalanceSelector,
    walletTokenBalanceSelector
} from '../store/selectors/walletSelectors'

const deposit = (ccy, amount, props) => {
    const {
        web3, 
        exchange, 
        token, 
        account, 
        walletEthBalance, 
        exchangeEthBalance, 
        walletTokenBalance,
        exchangeTokenBalance,
        dispatch
    } = props

    if(ccy === 'ETH') {
        depositETH(web3, exchange, account, walletEthBalance, exchangeEthBalance, amount, dispatch)
    } else {
        depositToken(web3, exchange, token, account, walletTokenBalance, exchangeTokenBalance, amount, dispatch )
    }
}

const withdraw = (ccy, amount, props) => {
    const {
        web3, 
        exchange, 
        token, 
        account, 
        walletEthBalance, 
        exchangeEthBalance, 
        walletTokenBalance,
        exchangeTokenBalance,
        dispatch
    } = props

    if(ccy === 'ETH') {
        withdrawETH(web3, exchange, account, walletEthBalance, exchangeEthBalance, amount, dispatch)
    } else {
        withdrawToken(web3, exchange, token, account, walletTokenBalance, exchangeTokenBalance, amount, dispatch )
    }
}

const submitEvent = (type, props) => {
    const amount = document.getElementById(`balanceAmount${type}`).value
    const ccy = document.getElementById(`balanceCcy${type}`).value

    if(isNaN(amount)) {
        window.alert(`Amount ${amount} is not valid`)
        return
    }

    if(type==='Deposit') {
        deposit(ccy, amount, props)
    } else {
        withdraw(ccy, amount, props)
    }
}

const showBalances = (type, props) => {
    const {walletEthBalance, walletTokenBalance, exchangeEthBalance, exchangeTokenBalance} = props

    return (
        <div>
            <table className="table table-dark table-sm small">
                <tbody>
                    <tr key={`${type}-1`}>
                        <th>Token</th>
                        <th>Wallet</th>
                        <th>Exchange</th>
                    </tr>
                    <tr key={`${type}-2`}>
                        <td>ETH</td>
                        <td>{walletEthBalance}</td>
                        <td>{exchangeEthBalance}</td>
                    </tr>
                    <tr key={`${type}-3`}>
                        <td>ELB</td>
                        <td>{walletTokenBalance}</td>
                        <td>{exchangeTokenBalance}</td>
                    </tr>
                </tbody>
            </table>
            <form className="row" onSubmit={(event) => {
                event.preventDefault()
                submitEvent(type, props)
            }}>
                <div className="col-12 col-sm pr-sm-2">
                    <input id={`balanceAmount${type}`} type="text" placeholder="Amount" className="form-control form-control-sm bg-dark text-white" required />
                </div>
                <div className="col-12 col-sm pr-sm-2" style={{'padding-left': '0px'}}>
                    <select id={`balanceCcy${type}`} className="form-control form-control-sm bg-dark text-white" required>    
                        <option value="ETH">ETH</option>
                        <option value="ELB">ELB</option>
                    </select>
                </div>
                <div className="col-12 col-sm-auto pl-sm-0">
                    <button type="submit" className="btn btn-primary btn-block btn-sm">{type}</button>
                </div>
            </form>
        </div>
    )
}

class Balance extends React.Component {
    componentDidMount() {
        this.loadBalances()
    }

    async loadBalances() {
        const {web3, account, dispatch, token, exchange} = this.props
        dispatch(loadingBalances(true))
        await loadWalletBalances(web3, account, token, dispatch)
        await loadExchangeBalances(account, exchange, token, dispatch)
        dispatch(loadingBalances(false))
    }
 
    render(){
    return (
        <div className="card bg-dark text-white">
            <div className="card-header">
                Balance
            </div>
            <div className="card-body">
                <Tabs defaultActiveKey="deposits" transition={false} id="balance" className="bg-dark text-white">
                    <Tab eventKey="deposits" title="Deposits" className="bg-dark">
                        {!this.props.loadingBalances ? showBalances('Deposit', this.props) : <Spinner />}
                    </Tab>
                    <Tab eventKey="withdraw" title="Withdraw" className="bg-dark">
                        {!this.props.loadingBalances ? showBalances('Withdraw', this.props) : <Spinner />}
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
    }
}

const mapStateToProps = (state) => {
    const loadingBalances = loadingBalancesSelector(state)
   
    return {
        web3: web3Selector(state),
        account: accountSelector(state),
        token: tokenSelector(state),
        exchange: exchangeSelector(state),
        loadingBalances: loadingBalances,
        walletEthBalance: walletEthBalanceSelector(state),
        walletTokenBalance: walletTokenBalanceSelector(state),
        exchangeEthBalance: exchangeEthBalanceSelector(state),
        exchangeTokenBalance: exchangeTokenBalanceSelector(state)
    }
}

export default connect(mapStateToProps)(Balance);
