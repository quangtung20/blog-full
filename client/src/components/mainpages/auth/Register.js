import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../utils/config'

function Register() {
    const [user, setUser] = useState({})

    const onChangeInput = e => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value })
    }

    const registerSubmit = async e => {

        e.preventDefault()
        try {
            await axios.post(`${API_URL}auth/register`, { ...user },{withCredentials:true})

            localStorage.setItem('firstLogin', true)

            alert("Your account is register, go to shop now.")
            window.location.href = "/";
        } catch (err) {
            alert(err.response.data.message)
        }
    }

    return (
        <div className="login-page">
            <form onSubmit={registerSubmit}>
                <h2>Register</h2>
                <input type="text" name="name" required
                    placeholder="Name" value={user.name} onChange={onChangeInput} />

                <input type="email" name="email" required
                    placeholder="Email" value={user.email} onChange={onChangeInput} />

                <input type="text" name="phoneNumber" required
                    placeholder="phone number" value={user.phoneNumber} onChange={onChangeInput} />

                <input type="password" name="password" required autoComplete="on"
                    placeholder="Password" value={user.password} onChange={onChangeInput} />

                <input type="password" name="confirmPassword" required autoComplete="on"
                    placeholder="Confirm Password" value={user.confirmPassword} onChange={onChangeInput} />

                <div className="row">
                    <button type="submit">Register</button>
                    <Link to="/login">Login</Link>
                </div>
            </form>
        </div>
    )
}

export default Register