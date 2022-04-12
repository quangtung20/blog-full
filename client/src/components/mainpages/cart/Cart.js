import React, { useContext, useState, useEffect } from 'react'
import { GlobalState } from '../../../GlobalState'
import axios from 'axios'
import PaypalButton from './PaypalButton'
import { API_URL } from '../utils/config'

function Cart() {
    const state = useContext(GlobalState)
    const [cart, setCart] = state.userAPI.cart
    const [token] = state.token
    const [total, setTotal] = useState(0)

    useEffect(() => {
        const getTotal = () => {
            const total = cart.reduce((prev, item) => {
                if (item.product) {
                    if ((item.product)?.status) {
                        return prev + (item.product.price * item.quantity)
                    } else {
                        return prev
                    }

                } else {
                    if (item.status) {
                        return prev + (item.price * item.quantity)
                    } else {
                        return prev
                    }
                }
            }, 0)

            setTotal(total)
        }

        getTotal()

    }, [cart])

    const addToCart = async (cart) => {
        const bearerTk = 'Bearer ' + token;
        await axios.patch(`${API_URL}/user/addcart`, { cart }, {
            headers: { Authorization: bearerTk }
        })
    }


    const increment = (id) => {
        cart.forEach(item => {
            if (item._id == id) {
                item.quantity += 1
            }
        })

        setCart([...cart])
        addToCart(cart)
    }

    const decrement = (id) => {
        cart.forEach(item => {
            if (item._id == id) {
                item.quantity == 1 ? item.quantity = 1 : item.quantity -= 1
            }
        })

        setCart([...cart])
        addToCart(cart)
    }

    const removeProduct = id => {
        if (window.confirm("Do you want to delete this product?")) {
            cart.forEach((item, index) => {
                if (item._id == id) {
                    cart.splice(index, 1)
                }
            })

            setCart([...cart])
            addToCart(cart)
        }
    }

    const tranSuccess = async (payment) => {
        const { paymentID, address } = payment;
        console.log(payment)
        const bearerTk = 'Bearer ' + token;
        await axios.post(`${API_URL}api/payment`, { cart, paymentID, address, total }, {
            headers: { Authorization: bearerTk }
        })

        setCart([])
        addToCart([])
        alert("You have successfully placed an order.")
    }


    if (cart.length === 0)
        return <h2 style={{ textAlign: "center", fontSize: "5rem" }}>Cart Empty</h2>
    console.log(cart)
    return (
        <div>
            {
                cart.map(product => (
                    <div className="detail cart">
                        <img src={(product.product) ? product.product.images.url : product.images.url} alt="" />

                        <div className="box-detail">
                            <h2>{(product.product) ? product.product.title : product.title}</h2>

                            <h3>$ {(product.product) ? (product.product.price * product.quantity) : (product.price * 1)}</h3>
                            <p>{(product.product) ? product.product.description : product.description}</p>
                            <p>{(product.product) ? product.product.content : product.content}</p>

                            {((product.product)?.status || ((product.status) || false)) ? (
                                <div className="amount">
                                    <button onClick={() => decrement(product._id)}> - </button>
                                    <span>{product.quantity}</span>
                                    <button onClick={() => increment(product._id)}> + </button>
                                </div>
                            ) : (
                                <h3>This Item has been sold out</h3>
                            )}
                            <div className="delete"
                                onClick={() => removeProduct(product._id)}>
                                X
                            </div>
                        </div>
                    </div>
                ))
            }

            <div className="total">
                <h3>Total: $ {total}</h3>
                <PaypalButton
                    total={total}
                    tranSuccess={tranSuccess} />
            </div>
        </div>
    )
}

export default Cart