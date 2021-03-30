import React from 'react'
import Trades from './Trades'
import OrderBook from './OrderBook'
import MyTransactions from './MyTransactions'
import PriceChart from './PriceChart'
import Balance from './Balance'
import { connect } from 'react-redux'
import { exchangeSelector} from '../store/selectors/index'
import { loadOrders, subscribeToEvents } from '../store/interactions/exchangeInteractions'

class Content extends React.Component {
  componentDidMount() {
    this.loadOrders(this.props.dispatch)
    this.subscribeToEvents(this.props.dispatch)
  }

  async loadOrders(dispatch)  {
    await loadOrders(this.props.exchange, dispatch)
  }

  subscribeToEvents(dispatch) {
    subscribeToEvents(this.props.exchange, dispatch)
  }

  render(){
    return (
        <div className="content">
            <div className="vertical-split">
              <Balance />
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
            <OrderBook />
            <div className="vertical-split">
              <PriceChart />
              <MyTransactions />
            </div>
            <Trades />
          </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    exchange: exchangeSelector(state)
  }
}

export default connect(mapStateToProps)(Content);
