import React from 'react'
import './style/App.css';
import Web3 from 'web3';
import Token from  '../abis/Token.json'

class App extends React.Component {
  componentWillMount() {
    this.loadBlockChainData()
  }
  
  async loadBlockChainData() {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545')
    const networkId = await web3.eth.net.getId()
    const networks = Token.networks
    const address = networks[networkId].address
    const abi = Token.abi
    const elberCoin = new web3.eth.Contract(abi, address)

    const name = await elberCoin.methods.name().call() //call cuando solo quieres info. send es para generar una transaccion y cambiar algo en el block chain
    const symbol = await elberCoin.methods.symbol().call()
    
    console.log('Name:', name )
    console.log('Symbol:', symbol )
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

export default App;
