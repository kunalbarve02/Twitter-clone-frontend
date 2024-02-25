import axios from 'axios'
import React,{ useEffect, useState } from 'react'
import { ArrowLeftShort } from 'react-bootstrap-icons'
import { Nav } from 'react-bootstrap'
import { useHistory, useParams } from 'react-router'
import './Profile.css'
import User from './User'

function Follow() {

    let { id } = useParams()
    let history = useHistory()

    let[user,setUser]=useState({})

    let [navKey,setNavKey] = useState("Followers")

    useEffect(()=>{
       axios.get('https://twitter-7ci7.onrender.com/api/user/followinfo',{
           params:{
               userID : id
           }
       })
       .then(res=>{
           setUser(res.data)
       })
       .catch(err=>{
           console.error(err)
       })
    },[])

    return (
        <>
            <div className="home-header">
                <h1 className="home-header-text"><ArrowLeftShort style={{cursor:"pointer"}} onClick={()=>{history.goBack()}} size={30}/> {user.FirstName} {user.LastName}</h1>
            </div>  
            <Nav className="justify-content-around profile-nav" activeKey={navKey}>
                <Nav.Item>
                    <Nav.Link onClick={()=>{setNavKey("Followers")}} eventKey="Followers" active={navKey === "Followers"}> Followers </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link onClick={()=>{setNavKey("Following")}} eventKey="Following" active={navKey === "Following"}> Following </Nav.Link>
                </Nav.Item>
            </Nav>
            {
                navKey === 'Followers'?
                user && user.followers? user.followers.map(follower=>(
                    <User userData = {follower}/>
                )):null:
                user && user.following? user.following.map(follower=>(
                    <User userData = {follower}/>
                )):null
            }
        </>
    )
}

export default Follow
