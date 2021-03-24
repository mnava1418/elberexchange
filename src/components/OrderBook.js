import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import Spinner from './Spinner'
import { connect } from 'react-redux'
import { allOrdersLoadedSelector, openOrdersSelector } from '../store/selectors/ordersSelector'

const showOrders = (orders, type) => {
  return(
    <tbody>
      <tr>
        <th>ELB</th>
        <th>ELB/ETH</th>
        <th>ETH</th>
      </tr>
      {orders[type].map((order) => {
        return(
          <tr className={`order-${order.id}`} key={order.id}>
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
                      { this.props.ordersLoaded ? showOrders(this.props.openOrders, 'Buy') : <Spinner type="table"/> }
                  </table>
                </Tab>
                <Tab eventKey="sellOrders" title="Sell" className="bg-dark">
                  <table className="table table-dark table-sm small">                        
                      { this.props.ordersLoaded ? showOrders(this.props.openOrders, 'Sell') : <Spinner type="table"/> }
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
  return {
      ordersLoaded: allOrdersLoadedSelector(state),
      openOrders: openOrdersSelector(state)
  }
}

export default connect(mapStateToProps)(Content);
