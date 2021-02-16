import React from 'react'
import { connect } from 'react-redux'
import './style/App.css';
import { 
  loadWeb3,
  loadAccount,
  loadToken,
  loadExchange
} from '../store/interactions'
import { accountSelector } from '../store/selectors'

class App extends React.Component {
  componentWillMount() {
    this.loadBlockChainData(this.props.dispatch)
  }
  
  async loadBlockChainData(dispatch) {
    const web3 = loadWeb3(dispatch)
    await loadAccount(web3, dispatch)
    await loadToken(web3, dispatch)
    await loadExchange(web3, dispatch)
  }

  render(){
    return (
      <div>
          <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <a className="navbar-brand" href="/#">Elber Exchange</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
              <ul className="navbar-nav">
              </ul>
            </div>
          </nav>
          <div className="content">
            <div className="vertical-split">
              <div className="card bg-dark text-white">
                <div className="card-header">
                  Card Title
                </div>
                <div className="card-body">
                  <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                  <a href="/#" className="card-link">Card link</a>
                </div>
              </div>
              <div className="card bg-dark text-white">
                <div className="card-header">
                  Card Title
                </div>
                <div className="card-body">
                  <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                  <a href="/#" className="card-link">Card link</a>
                </div>
              </div>
            </div>
            <div className="vertical">
              <div className="card bg-dark text-white">
                <div className="card-header">
                  Card Title
                </div>
                <div className="card-body">
                  <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                  <a href="/#" className="card-link">Card link</a>
                </div>
              </div>
            </div>
            <div className="vertical-split">
              <div className="card bg-dark text-white">
                <div className="card-header">
                  Card Title
                </div>
                <div className="card-body">
                  <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                  <a href="/#" className="card-link">Card link</a>
                </div>
              </div>
              <div className="card bg-dark text-white">
                <div className="card-header">
                  Card Title
                </div>
                <div className="card-body">
                  <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                  <a href="/#" className="card-link">Card link</a>
                </div>
              </div>
            </div>
            <div className="vertical">
              <div className="card bg-dark text-white">
                <div className="card-header">
                  Card Title
                </div>
                <div className="card-body">
                  <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                  <a href="/#" className="card-link">Card link</a>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps)(App);
