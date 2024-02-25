import axios from 'axios'
import React, { useState } from 'react'
import { Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'

import useDocumentTitle from '../../hooks/useDocumentTitle'
import './RegisterPage.css'

function RegisterPage() {
    useDocumentTitle("Signup")
    let history=useHistory()

    let[userData,setUserData]=useState({})
    let[isAlert,setIsAlert]=useState({
        msg:'',
        view:false
    })

    const handleSubmit=(e)=>{
        e.preventDefault()
        if(userData.password !== userData.passwordConf)
        {
            setIsAlert({msg:'Passwords do not match.Try Again',view:true})
        }
        else{
            setIsAlert(false)
            axios.post("https://twitter-7ci7.onrender.com/register",{userData:userData})
            .then((res)=>{
                console.log(res)
                if(res.data.msg === 'E-mail already in use. Please try another one.'|| res.data.msg === 'Username already in use. Please try another one.')
                {
                    setIsAlert({msg:res.data.msg,view:true})
                }
                else if(res.data.msg === 'User Successfully registered')
                {
                    history.replace("/")
                }
                if(res.data.token)
                {
                    window.sessionStorage.setItem("token", res.data.token);
                }
            })
            .catch((err)=>{
                console.log(err)
            })
        }
    }

    const handleChange = (e)=>{
        e.preventDefault()
        let name=e.target.name
        let value=e.target.value
        setUserData({...userData,[name]:value})
    }

    return (
        <>
        <div className="signup-page-container">
            <h1 style={{marginTop:"2%"}}>Sign Up to Twitter</h1>
            <form className="signup-page-form" onSubmit={handleSubmit}>
                <input type="text" className="signup-page-input" onChange={handleChange} placeholder="First Name" name="FirstName" required/>
                <input type="text" className="signup-page-input" onChange={handleChange} placeholder="Last Name" name="LastName" required />
                <input type="text" className="signup-page-input" onChange={handleChange} placeholder="Username" name="username" maxLength="12" required/>
                <input type="email" className="signup-page-input" onChange={handleChange} placeholder="E-mail" name="email" required/>
                <input type="password" className="signup-page-input" onChange={handleChange} placeholder="Password" name="password" minLength="6" required/>
                <input type="password" className="signup-page-input" onChange={handleChange} placeholder="Confirm Password" name="passwordConf" minLength="6" required/>
                {isAlert.view?<Alert variant="danger">{isAlert.msg}</Alert>:null}
                <input type="submit" className="signup-page-submit" onChange={handleChange} value="Signup"/>
                <Link to="/login" style={{textDecoration:"none"}}>Alredy have an Account? Click here</Link>
            </form>
        </div>
        </>
    )
}

export default RegisterPage
