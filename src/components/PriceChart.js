import React from 'react'
import Chart from 'react-apexcharts'
import { connect } from 'react-redux'
import Spinner from './Spinner'
import {chartOptions} from '../utils/priceChartUtil'

import { 
    priceChartDataLoadedSelector,
    priceChartDataSelector
} from '../store/selectors/priceChartSelector'

const getDirection = (direction) => {
    let output
    if(direction === 'up') {
      output = <span className="text-success">&#9650;</span> // Green up tiangle
    } else {
      output = <span className="text-danger">&#9660;</span> // Red down triangle
    }
    return(output)
  }

const showPriceData = (chartData) => {
    return(
        <div className="price-chart">
            <div className="price">
                <h4>ELB/ETH &nbsp; {getDirection(chartData.direction)} &nbsp; {chartData.lastPrice}</h4>
            </div>
            <Chart options={chartOptions} series={chartData.series} type='candlestick' width='100%' height='100%' />
        </div>
    )
}

class PriceChart extends React.Component {
  render(){
    return (
        <div className="card bg-dark text-white">
            <div className="card-header">
                Price Chart
            </div>
            <div className="card-body">
                {this.props.priceChartDataLoaded ? showPriceData(this.props.priceChartData) : <Spinner />}
            </div>
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
      priceChartDataLoaded: priceChartDataLoadedSelector(state),
      priceChartData: priceChartDataSelector(state)
  }
}

export default connect(mapStateToProps)(PriceChart);
