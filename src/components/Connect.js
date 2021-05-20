import React from 'react'
import {Button} from 'react-bootstrap'

const connectMetamask = async () => {
  const { ethereum } = window
  await ethereum.request({ method: 'eth_requestAccounts' })
  window.location.reload()
}

class Connect extends React.Component {

  getDownload() {
    return (
      <a href="https://metamask.io/download.html" target="_blank" rel="noreferrer" className="btn btn-primary">Download Metamask</a>
    )
  }

  getConnect() {
    return (
      <Button variant="primary" onClick={() => {connectMetamask()}}>Connect via Metamask</Button>
    )
  }

  render(){
      return (
        <div className="connect">
            <div className="metamask"></div>
            {this.props.type === 'connect' ? this.getConnect() : this.getDownload()}
        </div>  
    )
  }
}

export default Connect;
