import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import Spinner from './Spinner'
import { connect } from 'react-redux'
import { allOrdersLoadedSelector, openOrdersSelector, fillingOrderSelector } from '../store/selectors/ordersSelector'
import { accountSelector, exchangeSelector } from '../store/selectors'
import { fillOrder } from '../store/interactions/exchangeInteractions'

const showOrders = (props, type) => {
  const {openOrders, exchange, account, dispatch} = props

  return(
    <tbody>
      <tr>
        <th>ELB</th>
        <th>ELB/ETH</th>
        <th>ETH</th>
      </tr>
      {openOrders[type].map((order) => {
        return(
          <tr className={`order-${order.id} order-book-order`} key={order.id} onClick={() => {fillOrder(exchange, order.id, account, dispatch)}}>
            <td>{order.tokenAmount}</td>
            <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
            <td>{order.ethAmount}</td>
          </tr>
        )
      })}
    </tbody>
  )
}

class Content extends React.Component {
  render(){
    return (
        <div className="vertical">
          <div className="card bg-dark text-white">
            <div className="card-header">
                Order Book
            </div>
            <div className="card-body">
              <Tabs defaultActiveKey="buyOrders" transition={false} id="orderBook" className="bg-dark text-white">
                <Tab eventKey="buyOrders" title="Buy" className="bg-dark">
                  <table className="table table-dark table-sm small">                        
                      { this.props.showOrders ? showOrders(this.props, 'Buy') : <Spinner type="table"/> }
                  </table>
                </Tab>
                <Tab eventKey="sellOrders" title="Sell" className="bg-dark">
                  <table className="table table-dark table-sm small">                        
                      { this.props.showOrders ? showOrders(this.props, 'Sell') : <Spinner type="table"/> }
                  </table>
                </Tab>
              </Tabs>
            
            </div>
          </div>
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  const ordersLoaded = allOrdersLoadedSelector(state)
  const fillingOrder = fillingOrderSelector(state)
  const showOrders = ordersLoaded && !fillingOrder

  return {
      openOrders: openOrdersSelector(state),
      exchange: exchangeSelector(state),
      account: accountSelector(state),
      showOrders: showOrders
  }
}

export default connect(mapStateToProps)(Content);
