import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import Spinner from './Spinner'
import { connect } from 'react-redux'

import { 
    allOrdersLoadedSelector,
    filledOrdersLoadedSelector,
    myTradesSelector,
    myOpenOrdersSelector
} from '../store/selectors/ordersSelector'

const showMyTrades = (trades) => {
    return (
        <tbody>
            {trades.map((trade) => {
                return(
                    <tr className={`order-${trade.id}`} key={trade.id}>
                        <td className={`text-${trade.tradeTypeClass}`}>{trade.formattedTimestamp}</td>
                        <td className={`text-${trade.tradeTypeClass}`}>{`${trade.tradeSign}${trade.tokenAmount}`}</td>
                        <td className={`text-${trade.tradeTypeClass}`}>{trade.tokenPrice}</td>
                    </tr>
                )
            })}
        </tbody>
    )
}

const showMyOrders = (orders) => {
    return(
        <tbody>
          {orders['Buy'].map((order) => {
            return(
              <tr className={`order-${order.id}`} key={order.id}>
                <td className={`text-${order.orderTypeClass}`}>{order.tokenAmount}</td>
                <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
                <td className={`text-${order.orderTypeClass}`}>{order.ethAmount}</td>
              </tr>
            )
          })}
          {orders['Sell'].map((order) => {
            return(
              <tr className={`order-${order.id}`} key={order.id}>
                <td className={`text-${order.orderTypeClass}`}>{order.tokenAmount}</td>
                <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
                <td className={`text-${order.orderTypeClass}`}>{order.ethAmount}</td>
              </tr>
            )
          })}
        </tbody>
      )
}

class MyTransactions extends React.Component {
  render(){
    return (
        <div className="card bg-dark text-white">
            <div className="card-header">
                My Transactions
            </div>
            <div className="card-body">
            <Tabs defaultActiveKey="trades" transition={false} id="myTransactions" className="bg-dark text-white">
                <Tab eventKey="trades" title="Trades" className="bg-dark">
                    <table className="table table-dark table-sm small">   
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>ELB</th>
                                <th>ELB/ETH</th>
                            </tr>
                        </thead>
                        { this.props.filledOrdersLoaded ? showMyTrades(this.props.myTrades) : <Spinner type="table"/> }
                    </table>
                </Tab>
                <Tab eventKey="orders" title="Orders" className="bg-dark">
                    <table className="table table-dark table-sm small">   
                        <thead>
                            <tr>
                                <th>ELB</th>
                                <th>ELB/ETH</th>
                                <th>ETH</th>
                            </tr>
                        </thead>
                        { this.props.ordersLoaded ? showMyOrders(this.props.myOpenOrders) : <Spinner type="table"/> }
                    </table>
                </Tab>    
            </Tabs>
            </div>
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
      filledOrdersLoaded: filledOrdersLoadedSelector(state),
      myTrades: myTradesSelector(state),
      ordersLoaded: allOrdersLoadedSelector(state),
      myOpenOrders: myOpenOrdersSelector(state)
  }
}

export default connect(mapStateToProps)(MyTransactions);
