import React from 'react'
import Trades from './Trades'
import OrderBook from './OrderBook'
import MyTransactions from './MyTransactions'
import PriceChart from './PriceChart'
import Balance from './Balance'
import NewOrder from './NewOrder'
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
              <NewOrder />
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
