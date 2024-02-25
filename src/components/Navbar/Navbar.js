import React from 'react'
import { House, Twitter, Search, Bell, Envelope, Person, BoxArrowLeft} from 'react-bootstrap-icons'
import './Navbar.css'
import { Link, useHistory } from 'react-router-dom'
import { Badge } from 'react-bootstrap'

function Navbar() {

    let history=useHistory()
    let user = sessionStorage.getItem('user')
    user = JSON.parse(user)

    const handleLogout = ()=>{
        window.sessionStorage.clear()
        history.push("/login")
    }

    return (
        <div className="navbar-container">
            <Twitter color="#1DA1F2" size={30} style={{alignSelf:"self-start",marginLeft:"3.8vw",marginBottom:"1vh"}}/>
            <div className="navbar-wrapper">

                <Link to='/' style={{color:"initial",textDecoration:"none"}}>
                    <House color="#657786" size={30}/>
                </Link>
                <Link to='/' style={{color:"initial",textDecoration:"none"}}>
                    <p className="navbar-wrapper-text d-none d-lg-block">Home</p>
                </Link>
                
            </div>
            <div className="navbar-wrapper">

                <Link to={`/search`} style={{color:"initial",textDecoration:"none"}}>
                    <Search color="#657786" size={30}/>                   
                </Link>
                <Link to={`/search`} style={{color:"initial",textDecoration:"none"}}>
                    <p className="navbar-wrapper-text d-none d-lg-block">Search</p>                    
                </Link>

            </div>
            <div className="navbar-wrapper">
                <Link to={`/notifications`} style={{color:"initial",textDecoration:"none"}}>
                    <Bell color="#657786" size={28}/>
                    <Badge text="light">iol</Badge>
                </Link>
                <Link to={`/notifications`} style={{color:"initial",textDecoration:"none"}}>
                    <p className="navbar-wrapper-text d-none d-lg-block">Notifications</p>
                </Link>
            </div>
            <div className="navbar-wrapper">
                <Link to={`/messages`} style={{color:"initial",textDecoration:"none"}}>
                    <Envelope color="#657786" size={28}/>
                </Link>
                <Link to={`/messages`} style={{color:"initial",textDecoration:"none"}}>
                    <p className="navbar-wrapper-text d-none d-lg-block">Messages</p>
                </Link>
            </div>
                <div className="navbar-wrapper">
                    <Link to={user?`/profile/${user.id}`:null} style={{color:"initial",textDecoration:"none"}}>
                        <Person color="#657786" size={30}/>
                    </Link>
                    <Link to={user?`/profile/${user.id}`:null} style={{color:"initial",textDecoration:"none"}}>
                        <p className="navbar-wrapper-text d-none d-lg-block">Profile</p>
                    </Link>
                </div>
            <div className="navbar-wrapper">
                <BoxArrowLeft onClick={handleLogout} color="#657786" size={30}/>
                <p onClick={handleLogout} className="navbar-wrapper-text d-none d-lg-block">Logout</p>
            </div>
        </div>
    )
}

export default Navbar
