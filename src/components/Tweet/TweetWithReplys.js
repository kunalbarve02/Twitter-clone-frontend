import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import ReactTimeAgo from 'react-time-ago'
import { ArrowRepeat, Chat, Heart, HeartFill,ArrowLeftShort } from 'react-bootstrap-icons'
import { Spinner } from 'react-bootstrap'

import '../Tweet/Tweet.css'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import Tweet from './Tweet'

function TweetWithReplys() {

    let tweetId = useParams()
    let history = useHistory()

    let token =window.sessionStorage.getItem("token")

    let user = window.sessionStorage.getItem("user")
    user = JSON.parse(user)

    let [tweet,setTweet] = useState({})

    useEffect(()=>{
        console.log("useeffect")
        axios.get(`https://twitter-7ci7.onrender.com/api/posts/get/tweet/${tweetId.id}`)
        .then((res)=>{
            console.log(res.data) 
            setTweet(res.data)   
        })
        .catch((err)=>{
            console.log(err)
        })
    },[])

    const handleLike = (e)=>{
        e.preventDefault();
        axios.put(`https://twitter-7ci7.onrender.com/api/posts/${tweet._id}/${token}/like`)
        .then(res=>{
            setTweet(res.data)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const handleRetweet = (e)=>{
        e.preventDefault();
        axios.post(`https://twitter-7ci7.onrender.com/api/posts/${tweet._id}/${token}/retweet`)
        .then(res=>{
            console.log("retweeted")
            setTweet(res.data)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    useDocumentTitle(tweet.postedBy ?`${tweet.postedBy.username} on Twitter "${tweet.content}"`:"Twitter")
    //console.log(tweet.replies)

    return (
        <>
        <div className="home-header">
            <h1 className="home-header-text"><ArrowLeftShort style={{cursor:"pointer"}} onClick={()=>{history.goBack()}} size={30}/> Tweet</h1>
        </div>
        {tweet && tweet.postedBy ?
        <div className="Main-Tweet-container">
            <div className="Tweet-Content-wrapper">
                <img className="Tweet-profile-pic home-user-pic" 
                 src={tweet.postedBy&&tweet.postedBy.profilePic!=='https://res.cloudinary.com/kunalbarve/image/upload/v1629434967/TwitterClone/twitter-avi-gender-balanced-figure_qc6gdd.png'?
                 `https://twitter-7ci7.onrender.com/api/user/profilepic/${tweet.postedBy.profilePic}`:
                 'https://res.cloudinary.com/kunalbarve/image/upload/v1629434967/TwitterClone/twitter-avi-gender-balanced-figure_qc6gdd.png'
                 }
                 alt="Profile Pic"/>
                <div className="content-container">
                    <div className="Tweet-header">
                        <p className="tweet-name">
                            {tweet.postedBy.FirstName} {tweet.postedBy.LastName}
                        </p>
                        <p className="tweet-username">
                            @{tweet.postedBy.username} 
                        </p>                        
                        <p className="tweet-username">
                            {<ReactTimeAgo date={tweet.createdAt} timeStyle="twitter"/>}
                        </p>
                    </div>
                    <div className="Tweet-content">
                        <p className="Tweet-content-text">
                            {tweet.content}
                        </p>
                    </div>
                    <div className="Tweet-footer">
                            <div className="like-btn-container reply-btn">
                                <Chat className="tweet-footer-btn" size={20}/>
                            </div>
                            <div className="like-btn-container rt-btn">
                                {tweet.retweetUsers.includes(user.id)?<ArrowRepeat onClick={handleRetweet} className="tweet-footer-btn" color="#19cf86" size={20}/>:
                                <ArrowRepeat onClick={handleRetweet} className="tweet-footer-btn" color="#AA9590" size={20}/>}
                                <span style={{color:tweet.retweetUsers.includes(user.id)? '#19cf86': '#AA9590'}}>{ tweet.retweetUsers.length >0 ? tweet.retweetUsers.length : null}</span>
                            </div>
                            
                            <div className="like-btn-container" style={{color:tweet.likes.includes(user.id)? '#F91880': '#AA9590'}}>  
                                { tweet.likes.includes(user.id)?<HeartFill onClick={handleLike} color={"#f91880"} className="tweet-footer-btn like-btn" size={20}/>:
                                <Heart onClick={handleLike}className="tweet-footer-btn like-btn" size={20}/>}
                                <span>{ tweet.likes.length >0 ? tweet.likes.length : null}</span>
                            </div>
                        </div>
                </div>
            </div>
        </div>
        :
        <Spinner animation="border" variant="primary" className="mx-auto"/>}
        {
            tweet.replies?tweet.replies.map(reply=>(
                <>
                    <Tweet tweetData={reply}/>
                </>
        )):null
            }
        </>
    )
}

export default TweetWithReplys
