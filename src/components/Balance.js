import React from 'react'
import Spinner from './Spinner'
import { Tabs, Tab } from 'react-bootstrap'
import { connect } from 'react-redux'
import { loadWalletBalances } from '../store/interactions/walletInteractions'
import { loadExchangeBalances } from '../store/interactions/exchangeInteractions'
import { 
    web3Selector, 
    accountSelector, 
    tokenSelector,
    exchangeSelector,
    exchangeEthBalanceLoadedSelector,
    exchangeTokenBalanceLoadedSelector,
    exchangeEthBalanceSelector,
    exchangeTokenBalanceSelector
} from '../store/selectors'

import { 
    walletEthBalanceLoadedSelector, 
    walletEthBalanceSelector,
    walletTokenBalanceLoadedSelector,
    walletTokenBalanceSelector
} from '../store/selectors/walletSelectors'

const showBalances = (type, props) => {
    const {walletEthBalance, walletTokenBalance, exchangeEthBalance, exchangeTokenBalance} = props

    return (
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
    )
}



class Balance extends React.Component {
    componentDidMount() {
        this.loadBalances()
    }

    async loadBalances() {
        const {web3, account, dispatch, token, exchange} = this.props
        await loadWalletBalances(web3, account, token, dispatch)
        await loadExchangeBalances(account, exchange, token, dispatch)
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
                        {this.props.balancesLoaded ? showBalances('deposits', this.props) : <Spinner />}
                    </Tab>
                    <Tab eventKey="withdraw" title="Withdraw" className="bg-dark">
                        {this.props.balancesLoaded ? showBalances('withdraws', this.props) : <Spinner />}
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
    }
}

const mapStateToProps = (state) => {
    const walletEthBalanceLoaded = walletEthBalanceLoadedSelector(state)
    const walletTokenBalanceLoaded = walletTokenBalanceLoadedSelector(state)
    const exchangeEthBalanceLoaded = exchangeEthBalanceLoadedSelector(state)
    const exchangeTokenBalanceLoaded = exchangeTokenBalanceLoadedSelector(state)
    const balancesLoaded = walletEthBalanceLoaded && walletTokenBalanceLoaded && exchangeEthBalanceLoaded && exchangeTokenBalanceLoaded

    return {
        web3: web3Selector(state),
        account: accountSelector(state),
        token: tokenSelector(state),
        exchange: exchangeSelector(state),
        balancesLoaded: balancesLoaded,
        walletEthBalance: walletEthBalanceSelector(state),
        walletTokenBalance: walletTokenBalanceSelector(state),
        exchangeEthBalance: exchangeEthBalanceSelector(state),
        exchangeTokenBalance: exchangeTokenBalanceSelector(state)
    }
}

export default connect(mapStateToProps)(Balance);
