import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Alert } from 'react-bootstrap'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import socket_connection from '../../socket'
import { useState } from 'react'
import './LoginPage.css'
import { useHistory } from 'react-router-dom'

function LoginPage() {
    useDocumentTitle('Login')
    let history=useHistory()
    let[userData,setUserData]=useState({})
    let[isAlert,setIsAlert]=useState({
        msg:'',
        view:false
    })

    const handleSubmit = (e)=>{
        e.preventDefault()
        axios.post("https://twitter-7ci7.onrender.com/login",{userData:userData})
            .then((res)=>{
                console.log(res.data)
                if(res.data.msg === "User does not exist")
                {
                    setIsAlert({msg:res.data.msg,view:true})
                }
                else if(res.data.msg === "Passwords don't match")
                {
                    setIsAlert({msg:res.data.msg,view:true})
                }
                else if(res.data.msg === "User Successfully logged-in")
                {
                    window.sessionStorage.setItem("token", res.data.token);
                    console.log(res.data.user)
                    window.sessionStorage.setItem("user", JSON.stringify(res.data.user));
                    socket_connection.emit("setup",res.data.user)
                    history.replace("/")
                }

            })
    }

    const handleChange = (e)=>{
        e.preventDefault()
        let name=e.target.name
        let value=e.target.value
        setUserData({...userData,[name]:value})
    }

    return (
        <div className="login-page-container">
            <h1 style={{marginTop:"2%"}}>Log in to Twitter</h1>
            <form className="login-page-form" onSubmit={handleSubmit}>
                <input type="text" className="login-page-input" placeholder="Username" onChange={handleChange} name="username" minLength="5" maxLength="12" required/>
                <input type="password" className="login-page-input" placeholder="Password"  onChange={handleChange} name="password" minLength="6" required/>
                {isAlert.view?<Alert variant="danger">{isAlert.msg}</Alert>:null}
                <input type="submit" className="login-page-submit" value="Login"/>
                <Link to="/signup" style={{textDecoration:"none"}}>Sign Up for Twitter</Link>
            </form>
        </div>
    )
}

export default LoginPage
