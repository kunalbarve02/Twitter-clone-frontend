import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Nav } from 'react-bootstrap'
import { ArrowLeftShort, Search as TweetSearch } from 'react-bootstrap-icons'
import { useHistory } from 'react-router'
import Tweet from '../Tweet/Tweet'
import User from '../Profile/User'
import './Search.css'
import useDocumentTitle from '../../hooks/useDocumentTitle'

function Search() {
    
    let history = useHistory()

    let ssUser = sessionStorage.getItem('user')
    ssUser = JSON.parse(ssUser)

    let [ navKey,setNavKey ] = useState("Posts")
    let [ searchText, setSearchText ] = useState(null)
    let [ tweets, setTweets ] = useState([])
    let [ users, setUsers ] = useState([])

    useEffect(()=>{
        if(ssUser === null||ssUser === undefined)
        {
            history.replace("/login")
        }
    },[])

    const handleSearchbar = (e)=>{
        console.log(e.target.value)
        if(navKey === 'Posts')
        {
            if(e.target.value !=="")
            {
                axios.get("https://twitter-7ci7.onrender.com/api/posts/search",{
                params:{
                    search : e.target.value
                }
                })
                .then(res=>{setTweets(res.data)})
                .catch((err)=>{console.log(err)})
            }
            else
            {
                setTweets([])
            }
        }
        if(navKey === 'Users')
        {
            if(e.target.value !=="")
            {
                axios.get("https://twitter-7ci7.onrender.com/api/user/search",{
                params:{
                    search : e.target.value
                }
                })
                .then(res=>{
                    console.log(res.data)
                    setUsers(res.data)
                })
                .catch((err)=>{console.log(err)})
            }
            else
            {
                setUsers([])
            }
        }
    }

    useDocumentTitle("Seacrh")

    return (
        <div style={{minHeight:"100vh"}}>
            <div className="home-header">
                <h1 className="home-header-text"><ArrowLeftShort style={{cursor:"pointer"}} onClick={()=>{history.goBack()}} size={30}/> Search</h1>
            </div>  
            <div className="searchbar-container">
                <TweetSearch className="search-icon"/>
                <input value={searchText} className="searchbar" onChange={handleSearchbar} placeholder="Search for Users or Tweets" type="text" name="searchbar"/>
            </div>
            <Nav className="justify-content-around profile-nav" activeKey={navKey}>
                <Nav.Item>
                    <Nav.Link onClick={()=>{setNavKey("Posts")}} eventKey="Posts" active={navKey === "Posts"}> Posts </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link onClick={()=>{setNavKey("Users")}} eventKey="Users" active={navKey === "Users"}> Users </Nav.Link>
                </Nav.Item>
            </Nav>
            {
                tweets&&navKey==="Posts"&&tweets.map(tweet=>(
                    <>
                        <Tweet tweetData = {tweet}/>
                    </>
                ))
            }
            {
                users&&navKey==="Users"&&users.map(user=>(
                    <>
                        <User userData={user}/>{console.log(users)}
                    </>
                ))
            }
        </div>
    )
}

export default Search