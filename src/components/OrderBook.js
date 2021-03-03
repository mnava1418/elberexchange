import React from 'react'
import Spinner from './Spinner'
import { connect } from 'react-redux'
import { allOrdersLoadedSelector, openOrdersSelector } from '../store/selectors/ordersSelector'

const showOrders = (orders) => {
  return(
    <tbody>
      {orders['Buy'].map((order) => {
        return(
          <tr className={`order-${order.id}`} key={order.id}>
            <td>{order.tokenAmount}</td>
            <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
            <td>{order.ethAmount}</td>
          </tr>
        )
      })}
      <tr>
        <th>ELB</th>
        <th>ELB/ETH</th>
        <th>ETH</th>
      </tr>
      {orders['Sell'].map((order) => {
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
                    <table className="table table-dark table-sm small">                        
                        { this.props.ordersLoaded ? showOrders(this.props.openOrders) : <Spinner type="table"/> }
                    </table>
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
