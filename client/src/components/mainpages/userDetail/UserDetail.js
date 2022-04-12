import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'
import { API_URL } from '../utils/config'

const UserDetail = props => {
    const [user, setUser] = useState({
    })
    const state = useContext(GlobalState)
    const [token] = state.token

    useEffect(() => {
        if (token) {
            const getUser = async () => {
                try {
                    const bearerTk = 'Bearer ' + token;
                    const res = await axios.get(`${API_URL}/user/infor`, {
                        headers: { Authorization: bearerTk }
                    })
                    setUser(res.data)

                } catch (err) {
                    alert(err)
                }
            }

            getUser()

        }
    }, [token])

    const onChangeInput = e => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value })
    }

    const updateSubmit = async e => {
        e.preventDefault()
        try {
             const bearerTk = 'Bearer '+token;
            await axios.put(`${API_URL}/user/update/${user._id}`, { name:user.name, phoneNumber:user.phoneNumber, email:user.email },{headers: {Authorization: bearerTk}})

            localStorage.setItem('firstLogin', true)

            alert("Your account is updated.")
            window.location.href = "/";
        } catch (err) {
            alert(err.response.data.message)
        }
    }

        const changPasswordSubmit = async e => {

        e.preventDefault()
        try {
             const bearerTk = 'Bearer '+token;
            await axios.put(
                `${API_URL}/user/password/${user._id}`, 
                { oldPassword:user.oldPassword, newPassword:user.newPassword, confirmPassword:user.confirmPassword },
                {headers: {Authorization: bearerTk}}
            )

            localStorage.setItem('firstLogin', true)

            alert("Your account is updated.")
            window.location.href = "/";
        } catch (err) {
            alert(err.response.data.message)
        }
    }
    return (
        <div className="login-page">
            <form onSubmit={updateSubmit}>
                <h2>Profile</h2>
                <input type="text" name="name" required
                    placeholder="Name" value={user.name} onChange={onChangeInput} />

                <input type="email" name="email" required
                    placeholder="Email" value={user.email} onChange={onChangeInput} />

                <input type="text" name="phoneNumber" required
                    placeholder="phone number" value={user.phoneNumber} onChange={onChangeInput} />


                <div className="row">
                    <button type="submit">Update</button>
                </div>
            </form>
            <br></br>
            <form onSubmit={changPasswordSubmit}>
                <h2>Change Password</h2>
                <input type="password" name="oldPassword" required autoComplete="on"
                    placeholder="Old Password" value={user.oldPassword} onChange={onChangeInput} />

                <input type="password" name="newPassword" required
                    placeholder="New Password" value={user.newPassword} onChange={onChangeInput} />

                <input type="password" name="confirmPassword" required
                    placeholder="Confirm Password" value={user.confirmPassword} onChange={onChangeInput} />


                <div className="row">
                    <button type="submit">Change</button>
                </div>
            </form>
        </div>
    )
}


export default UserDetail