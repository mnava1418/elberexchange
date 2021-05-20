import React from 'react'
import { connect } from 'react-redux'
import './style/App.css';

import NavBar from './NavBar'
import Content from './Content'
import Connect from './Connect'

import { loadWeb3, loadAccount } from '../store/interactions/web3Interactions'
import { loadToken } from '../store/interactions/tokenInteractions'
import { loadExchange } from '../store/interactions/exchangeInteractions'
import { accountSelector, contractsLoadedSelector } from '../store/selectors/index'

class App extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      connectType: ''
    }
  }
  
  componentDidMount() {
    this.detectMetamask()
  }
  
  detectMetamask() {
    if (window.ethereum) {
      this.handleEthereum()
    } else {
      window.addEventListener('ethereum#initialized', this.handleEthereum(), {
        once: true,
      });

      setTimeout(this.handleEthereum(), 3000);
    }
  }

  handleEthereum() {
    const { ethereum } = window;

    if(ethereum && ethereum.isMetaMask) {
      this.loadBlockChainData(this.props.dispatch)
    } else {
      this.setState((state) => ({...state, connectType: 'download'}))
    }
  }

  async loadBlockChainData(dispatch) {
    const web3 = loadWeb3(dispatch)
    const account = await loadAccount(web3, dispatch)

    const token = await loadToken(web3, dispatch)
    const exchange = await loadExchange(web3, dispatch)

    if(!account) {
      this.setState((state) => ({...state, connectType: 'connect'}))
      return
    } 

    if(!token || ! exchange) {
      window.alert('Contracts not found in current network. Please select another network via Metamask')
      return
    }   
  }

  render(){
    return (
        <div>
          <NavBar />
          { (this.props.contractsLoaded && this.props.account) ? <Content /> : <Connect type={this.state.connectType} /> }
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
