import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'

function OrderDetails() {
    const state = useContext(GlobalState)
    const [history] = state.userAPI.history
    const [orderDetails, setOrderDetails] = useState([])
    const params = useParams()

    useEffect(() => {
        if (params.id) {
            history.forEach(item => {
                if (item._id == params.id) setOrderDetails(item)
            })
        }
    }, [params.id, history])

    if (orderDetails.length === 0) return null;
    console.log(orderDetails);
    return (
        <div className="history-page">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Email</th>
                        <th>Phone</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{orderDetails.user.name}</td>
                        <td>{orderDetails.address}</td>
                        <td>{orderDetails.user.email}</td>
                        <td>{orderDetails.user.phoneNumber}</td>
                    </tr>
                </tbody>
            </table>

            <table style={{ margin: "30px 0px" }}>
                <thead>
                    <tr>
                        <th></th>
                        <th>Products</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        orderDetails.cart.map(item => {
                            return (
                                <tr key={item._id}>
                                    <td><img src={item.product.images.url} alt="" /></td>
                                    <td>{item.product.title}</td>
                                    <td>{item.quantity}</td>
                                    <td>$ {item.product.price * item.quantity}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <h3 className="total">Total:{orderDetails.cart.reduce((prev, item) => {
                console.log(orderDetails)
                return prev + (item.product.price * item.quantity)
            }, 0)}</h3>
        </div>
    )
}

export default OrderDetails
