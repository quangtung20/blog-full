import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../components/mainpages/utils/config'

function UserAPI(token) {
    const [isLogged, setIsLogged] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [cart, setCart] = useState([])
    const [user, setUser] = useState({})
    const [history, setHistory] = useState([])

    useEffect(() => {
        if (token) {
            const getUser = async () => {
                try {
                    const bearerTk = 'Bearer ' + token;
                    const res = await axios.get(`${API_URL}/user/infor`, {
                        headers: { Authorization: bearerTk }
                    })

                    setIsLogged(true)
                    res.data.role === 2 ? setIsAdmin(true) : setIsAdmin(false)
                    setCart(res.data.cart)
                    setUser(res.data)

                } catch (err) {
                    alert(err)
                }
            }

            getUser()

        }
    }, [token])



    const addCart = async (product) => {
        if (!isLogged) return alert("Please login to continue buying");

        const check = cart.every(item => {
            return (item.product_id) !== (product.product_id);
        })

        if (check) {
            setCart([...cart, { ...product, quantity: 1 }])

            const bearerTk = 'Bearer ' + token;
            await axios.patch(`${API_URL}/user/addcart`, { cart: [...cart, { ...product, quantity: 1 }] }, {
                headers: { Authorization: bearerTk }
            })

        } else {
            alert("This product has been added to cart.")
        }
    }

    return {
        isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin],
        cart: [cart, setCart],
        user: [user, setUser],
        addCart: addCart,
        history: [history, setHistory]
    }
}

export default UserAPI
