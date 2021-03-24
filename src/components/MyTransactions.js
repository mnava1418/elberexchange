import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import Spinner from './Spinner'
import { connect } from 'react-redux'
import {cancelOrder} from '../store/interactions/exchangeInteractions'
import {accountSelector, exchangeSelector, performingActionSelector} from '../store/selectors'

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

const showMyOrders = (props, type) => {
  const {myOpenOrders, exchange, account, dispatch} = props

  return(
        <tbody>
          {myOpenOrders[type].map((order) => {
            return(
              <tr className={`order-${order.id}`} key={order.id}>
                <td className={`text-${order.orderTypeClass}`}>{order.tokenAmount}</td>
                <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
                <td className={`text-${order.orderTypeClass}`}>{order.ethAmount}</td>
                <td className="text-muted cancel-order" 
                  onClick={() => {cancelOrder(exchange, order.id, account, dispatch)}}
                >
                  X
                </td>
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
                <Tab eventKey="buyOrders" title="Buy Orders" className="bg-dark">
                    <table className="table table-dark table-sm small">   
                        <thead>
                            <tr>
                                <th>ELB</th>
                                <th>ELB/ETH</th>
                                <th>ETH</th>
                                <th> Cancel</th>
                            </tr>
                        </thead>
                        { this.props.showOrders ? showMyOrders(this.props, 'Buy') : <Spinner type="table"/> }
                    </table>
                </Tab>
                <Tab eventKey="sellOrders" title="Sell Orders" className="bg-dark">
                    <table className="table table-dark table-sm small">   
                        <thead>
                            <tr>
                                <th>ELB</th>
                                <th>ELB/ETH</th>
                                <th>ETH</th>
                                <th> Cancel</th>
                            </tr>
                        </thead>
                        { this.props.showOrders ? showMyOrders(this.props, 'Sell') : <Spinner type="table"/> }
                    </table>
                </Tab>        
            </Tabs>
            </div>
        </div>
    );
  }
}

const mapStateToProps = (state) => {

    const ordersLoaded= allOrdersLoadedSelector(state)
    const performingAction = performingActionSelector(state)
    const showOrders = ordersLoaded && !performingAction

  return {
      filledOrdersLoaded: filledOrdersLoadedSelector(state),
      myTrades: myTradesSelector(state),
      myOpenOrders: myOpenOrdersSelector(state),
      exchange: exchangeSelector(state),
      account: accountSelector(state),
      showOrders: showOrders,
  }
}

export default connect(mapStateToProps)(MyTransactions);
