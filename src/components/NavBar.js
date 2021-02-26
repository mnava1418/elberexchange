import React from 'react'
import { connect } from 'react-redux'
import { accountSelector } from '../store/selectors/index'

class NavBar extends React.Component {
  render(){
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <a className="navbar-brand" href="/#">Elber Exchange</a>
            <ul className="navbar-nav ml-auto">
                <li className= "nav-item">
                    <a
                    className="nav-link small"
                    href={`https://etherscan.io/address/${this.props.account}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                        {this.props.account}
                    </a>
                </li>
            </ul>
        </nav>
    );
  }
}

const mapStateToProps = (state) => {
  return {
      account: accountSelector(state)
  }
}

export default connect(mapStateToProps)(NavBar);
