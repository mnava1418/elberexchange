import React from 'react'
import { connect } from 'react-redux'
import './style/App.css';

import NavBar from './NavBar'
import Content from './Content'

import { loadWeb3, loadAccount } from '../store/interactions/web3Interactions'
import { loadToken } from '../store/interactions/tokenInteractions'
import { loadExchange } from '../store/interactions/exchangeInteractions'
import { accountSelector, contractsLoadedSelector } from '../store/selectors/index'

class App extends React.Component {
  componentDidMount() {
    this.loadBlockChainData(this.props.dispatch)
  }
  
  async loadBlockChainData(dispatch) {
    const web3 = loadWeb3(dispatch)
    const account = await loadAccount(web3, dispatch)

    const token = await loadToken(web3, dispatch)
    const exchange = await loadExchange(web3, dispatch)

    if(!token || ! exchange) {
      window.alert('Contracts not found in current network. Please select another network via Metamask')
      return
    }

    if(!account) {
      window.alert('Account not connected. Please connect account via Metamask')
      return
    } 
  }

  render(){
    return (
        <div>
          <NavBar />
          { (this.props.contractsLoaded && this.props.account) ? <Content /> : <div className="content"></div>}
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    contractsLoaded: contractsLoadedSelector(state),
    account: accountSelector(state)
  }
}

export default connect(mapStateToProps)(App);
