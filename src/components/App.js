import React from 'react'
import { connect } from 'react-redux'
import './style/App.css';
import NavBar from './NavBar'
import Content from './Content'
import { 
  loadWeb3,
  loadAccount,
  loadToken,
  loadExchange
} from '../store/interactions'
import { contractsLoadedSelector } from '../store/selectors'

class App extends React.Component {
  componentWillMount() {
    this.loadBlockChainData(this.props.dispatch)
  }
  
  async loadBlockChainData(dispatch) {
    const web3 = loadWeb3(dispatch)
    const account = await loadAccount(web3, dispatch)
    const token = await loadToken(web3, dispatch)
    const exchange = await loadExchange(web3, dispatch)

    if(!account) {
      window.alert('Account not connected. Please connect via Metamask')
    }

    if(!token || !exchange) {
      window.alert('Contracts not found in current network. Please update via Metamask')
    }
  }

  render(){
    return (
        <div>
          <NavBar />
          { this.props.contractsLoaded ? <Content /> : <div className="content"></div>}
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    contractsLoaded: contractsLoadedSelector(state)
  }
}

export default connect(mapStateToProps)(App);
