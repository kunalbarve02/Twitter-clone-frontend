import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { Button } from 'react-bootstrap'
import './SubmitTweet.css'

function SubmitTweet(props) {

    let[isBtnActive,setBtnActive]=useState(true)
    let[tweetContent,setTweetContent]=useState("")

    let token =window.sessionStorage.getItem("token") 
    let user = sessionStorage.getItem("user")
    user = JSON.parse(user)

    const handleSubmit = (e)=>{
        setTweetContent("")
        e.preventDefault();
        axios.post('https://twitter-7ci7.onrender.com/api/posts',{tweetContent:tweetContent.trim(),token:token})
        .then((res)=>{
            console.log(res.data)
            //props.setTweetData((prevTweetData)=>[...prevTweetData,res.data])
            props.setTweetData([...res.data])
        })
        .catch((err=>{
            console.log(err)
        }))
    }

    const handleChange =(e)=>{
        var value=e.target.value
        console.log(value)
        if (value)
        {   
            setBtnActive(false)
            setTweetContent(value)
            console.log(value);
        }
        else
        {
            setBtnActive(true)
            setTweetContent(value)
        }
    }

    return (
        <div className="home-tweet-container">
            <img src={user&&user.profilepic!=='https://res.cloudinary.com/kunalbarve/image/upload/v1629434967/TwitterClone/twitter-avi-gender-balanced-figure_qc6gdd.png'?
                `https://twitter-7ci7.onrender.com/api/user/profilepic/${user.profilepic}`:'https://res.cloudinary.com/kunalbarve/image/upload/v1629434967/TwitterClone/twitter-avi-gender-balanced-figure_qc6gdd.png'
                } className="home-user-pic" alt="Profile Pic"/>
            <div className="home-tweet-inner-container">
                <textarea className="home-tweet-textarea" value={tweetContent} onChange={handleChange} placeholder="What's happening?">

                </textarea>
                <Button onClick={handleSubmit} id="tweet-submit-btn" variant="primary" className="home-tweet-btn" disabled={isBtnActive}>Tweet</Button>
            </div>
        </div>
    )
}

export default SubmitTweet