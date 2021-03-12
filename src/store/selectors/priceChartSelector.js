import { createSelector } from 'reselect'
import { groupBy, maxBy, minBy} from 'lodash'
import moment from 'moment'
import {
    filledOrdersLoaded, 
    filledOrders,
    decorateFilledOrders
} from './ordersSelector'

export const priceChartDataLoadedSelector = createSelector(filledOrdersLoaded, loaded => loaded)
export const priceChartDataSelector = createSelector(
    filledOrders,
    (orders) => {
        orders = orders.sort((a,b) => ( a.timeStamp - b.timeStamp ))
        orders = decorateFilledOrders(orders)

        const graphData = getGraphData(orders)
        const lastPrice = orders.length > 0 ? orders[orders.length - 1].tokenPrice : 0
        const lastClosePrice = graphData.length <= 1 ? lastPrice : graphData[graphData.length - 2].y[3]
        const direction = (lastPrice >= lastClosePrice) ? 'up' : 'down'
        
        const series = [{data: graphData}]
        const priceChartData = { series, lastPrice, direction }
        return priceChartData
    }
)

const getGraphData = (orders) => {
    orders = groupBy(orders, (o) => moment.unix(o.timeStamp).startOf('hour').format())
    const hours = Object.keys(orders)

    const graphData = hours.map(hour => {
        const group = orders[hour]
        const open = group[0]
        const high = maxBy(group, 'tokenPrice')
        const low = minBy(group, 'tokenPrice')
        const close = group[group.length - 1]

        return({
            x: hour,
            y:[open.tokenPrice, high.tokenPrice, low.tokenPrice, close.tokenPrice]
        })
    })

    return graphData    
}