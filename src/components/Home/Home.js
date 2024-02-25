import axios from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import Tweet from '../Tweet/Tweet'
import './Home.css'
import SubmitTweet from './SubmitTweet/SubmitTweet'
import socket_connection from '../../socket'

function Home() {
    useDocumentTitle('Twitter')
    let history=useHistory()
    let token = window.sessionStorage.getItem("token");
    let user = window.sessionStorage.getItem("user")
    //user = JSON.stringify(user)
    user = JSON.parse(user)

    let[tweetData,setTweetData]=useState([])

    //console.log(user)
    useEffect(()=>{
        axios.get('https://twitter-7ci7.onrender.com/', {
            headers: {
                'Bearer': token 
            }
        })
        .then((res)=>{
            if(res.status === 202)
            {
                history.push("/login")
            }
        })
        .catch((err)=>{
            console.log(err)
        })

        // eslint-disable-next-line
    },[])

    useEffect(()=>{
        async function getTweets(){
            let res = await axios.get('https://twitter-7ci7.onrender.com/api/posts',{
                params:{
                    id:user?.id
                }
            })
            setTweetData(res.data)
        }
        getTweets()
        /*axios.get('https://twitter-7ci7.onrender.com/api/posts',{
            params:{
                id:user.id
            }
        })
        .then((res)=>{
            console.log(res.data)
            setTweetData(res.data)
        })
        .catch((err)=>{
            console.log(err)
        })*/
    },[])

    return (
        <>
            <div className="home-header">
                <h1 className="home-header-text">Home</h1>
            </div>
            <SubmitTweet setTweetData={setTweetData}/>
            
            {console.log(tweetData)}
            {
                tweetData.map((tweet)=>(
                <Tweet key={tweet._id} tweetData={tweet} />
            ))}
        </>
    )
}

export default Home
