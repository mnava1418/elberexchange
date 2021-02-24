import React from 'react'
import Spinner from './Spinner'
import { connect } from 'react-redux'

import {
    filledOrdersLoadedSelector,
    filledOrdersSelector
} from '../store/selectors'

const showTrades = (trades) => {
    return (
        <tbody>
            {trades.map((trade) => {
                return(
                    <tr className={`order-${trade.id}`} key={trade.id}>
                        <td className="text-muted">{trade.formattedTimestamp}</td>
                        <td>{trade.tokenAmount}</td>
                        <td className={`text-${trade.tokenPriceClass}`}>{trade.tokenPrice}</td>
                    </tr>
                )
            })}
        </tbody>
    )
}

class Trades extends React.Component {
  render(){
    return (
        <div className="vertical">
            <div className="card bg-dark text-white">
                <div className="card-header">
                    Trades
                </div>
                <div className="card-body">
                    <table className="table table-dark table-striped table-sm small">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>ELB</th>
                                <th>ELB/ETH</th>
                            </tr>
                        </thead>
                        { this.props.filledOrdersLoaded ? showTrades(this.props.filledOrders) : <Spinner type="table"/> }
                    </table>
                </div>
            </div>
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
      filledOrdersLoaded: filledOrdersLoadedSelector(state),
      filledOrders: filledOrdersSelector(state)
  }
}

export default connect(mapStateToProps)(Trades);
