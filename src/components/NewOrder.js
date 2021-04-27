import React from 'react'
import Spinner from './Spinner'
import {Tabs, Tab, Form, Button} from 'react-bootstrap'
import {connect} from 'react-redux'
import {creatingOrderSelector} from '../store/selectors/ordersSelector'
import {createOrder} from '../store/interactions/exchangeInteractions'
import {ETH_ADDRESS} from '../utils/ethUtil'
import { 
    accountSelector, 
    tokenSelector,
    exchangeSelector,
    web3Selector
} from '../store/selectors'

class NewOrder extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            totalAmount: 0
        }

        this.calculateTotal = this.calculateTotal.bind(this)
        this.generateOrder = this.generateOrder.bind(this)
    }

    generateOrder (orderType) {
        const {exchange, account, token, dispatch, web3} = this.props
        const elbAmount = parseFloat(document.getElementById('amount').value)
        const ethAmount = this.state.totalAmount

        if(!isNaN(elbAmount) && !isNaN(ethAmount)) {
            if(orderType === 'Buy') {
                createOrder(web3, exchange, account, token._address, elbAmount.toString(), ETH_ADDRESS, ethAmount.toString(), dispatch)
            } else {
                createOrder(web3, exchange, account, ETH_ADDRESS, ethAmount.toString, token._address, elbAmount.toString(), dispatch)
            }
        }
    }

    calculateTotal () {
        const amount = parseFloat(document.getElementById('amount').value)
        const price = parseFloat(document.getElementById('price').value)

        if(isNaN(amount) || isNaN(price)) {
            this.setState((state) => ({...state, totalAmount: 0}))
        } else {
            this.setState((state) => ({...state, totalAmount: amount * price}))
        }
    }

    getOrderForm (orderType) {
        return(
            <Form onSubmit={(event) =>{
                event.preventDefault()
                this.generateOrder(orderType)
            }}>
                <Form.Group>
                    <Form.Label>{`${orderType} (ELB)`}</Form.Label>
                    <Form.Control id="amount" type="text" placeholder="Amount" className="form-control form-control-sm bg-dark text-white" onChange={this.calculateTotal} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>{`${orderType} price`}</Form.Label>
                    <Form.Control id="price" type="text" placeholder="Price" className="form-control form-control-sm bg-dark text-white" onChange={this.calculateTotal} />
                </Form.Group>
                <Form.Group controlId="formTotal" style={{width: "100%"}}>
                    <Form.Label>Total: {this.state.totalAmount} ETH</Form.Label>
                </Form.Group>
                <Button variant="primary" type="submit" style={{width: "100%"}}>
                    {orderType}
                </Button>
            </Form>
        )
    }

    render() {
        return (
            <div className="card bg-dark text-white">
                <div className="card-header">
                  New Order
                </div>
                <div className="card-body">
                    <Tabs defaultActiveKey="buyNew" transition={false} id="newOrders" className="bg-dark text-white">
                        <Tab eventKey="buyNew" title="Buy" className="bg-dark">
                            {!this.props.creatingOrder ? this.getOrderForm('Buy') : <Spinner />}
                        </Tab>
                        <Tab eventKey="sellNew" title="Sell" className="bg-dark">
                            {!this.props.creatingOrder ? this.getOrderForm('Sell') : <Spinner />}
                        </Tab>
                    </Tabs>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        creatingOrder: creatingOrderSelector(state),
        account: accountSelector(state),
        token: tokenSelector(state),
        exchange: exchangeSelector(state),
        web3: web3Selector(state),
    }
}

export default connect(mapStateToProps)(NewOrder);