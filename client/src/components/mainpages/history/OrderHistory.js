import React, { useContext, useEffect } from 'react'
import { GlobalState } from '../../../GlobalState'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../utils/config'

function OrderHistory() {
    const state = useContext(GlobalState)
    const [history, setHistory] = state.userAPI.history
    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token


    useEffect(() => {
        if (token) {
            const getHistory = async () => {
                if (isAdmin) {
                    const bearerTk = 'Bearer ' + token;
                    const res = await axios.get(`${API_URL}/api/payment`, {
                        headers: { Authorization: bearerTk }
                    })
                    setHistory(res.data)
                } else {
                    const bearerTk = 'Bearer ' + token;
                    const res = await axios.get(`${API_URL}/user/history`, {
                        headers: { Authorization: bearerTk }
                    })
                    setHistory(res.data)
                }
            }
            getHistory()
        }
    }, [token, isAdmin, setHistory])

    return (
        <div className="history-page">
            <h2>History</h2>

            <h4>You have {history.length} ordered</h4>

            <table>
                <thead>
                    <tr>
                        <th>Payment ID</th>
                        <th>Date of Purchased</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        history.map(items => (
                            <tr key={items._id}>
                                <td>{items.paymentID}</td>
                                <td>{new Date(items.created_at).toLocaleDateString()}</td>
                                <td><Link to={`/history/${items._id}`}>View</Link></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default OrderHistory
