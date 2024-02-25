import React from 'react'
import { Chat, Heart, HeartFill, Pin, PinFill } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom'
import { ArrowRepeat } from 'react-bootstrap-icons'
import { Modal, Button } from 'react-bootstrap'
import ReactTimeAgo from 'react-time-ago'
import './Tweet.css'
import '../Home/SubmitTweet/SubmitTweet.css'
import axios from 'axios'
import { useState } from 'react'
import socket_connection from '../../socket.js'


function Tweet(props) {

    let token =window.sessionStorage.getItem("token")

    let user = window.sessionStorage.getItem("user")

    const defPicLink = 'https://res.cloudinary.com/kunalbarve/image/upload/v1629434967/TwitterClone/twitter-avi-gender-balanced-figure_qc6gdd.png'
    //user = JSON.stringify(user)
    user = JSON.parse(user)
    console.log(user)

    let [currentTweet,setCurrentTweet]=useState(props.tweetData)
    let [isRetweet, setIsRetweet] = useState(false)
    let [modalShow, setModalShow] = useState(false)
    let [isBtnActive,setBtnActive] = useState(true)
    let [tweetContent,setTweetContent] = useState("")
    let [rtPostedby,setRtPostedBy] = useState({})
    let [socket, setSocket] = useState(socket_connection)

    console.log(currentTweet.replyTo)

    if(currentTweet.retweetData !== undefined)
    {
        setRtPostedBy(currentTweet.postedBy)
        setCurrentTweet(currentTweet.retweetData)
        setIsRetweet(true)
    }

    const handleChange =(e)=>{
        var value=e.target.value.trim()
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
        }
    }

    const handleLike = (e)=>{
        e.preventDefault();
        axios.put(`https://twitter-7ci7.onrender.com/api/posts/${currentTweet._id}/${token}/like`)
        .then(res=>{
            setCurrentTweet(res.data)
            socket.emit("notification",res.data)
            handleSendNotification('like')
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const handleRetweet = (e)=>{
        e.preventDefault();
        axios.post(`https://twitter-7ci7.onrender.com/api/posts/${currentTweet._id}/${token}/retweet`)
        .then(res=>{
            console.log("retweeted")
            setCurrentTweet(res.data)
            handleSendNotification('retweet')
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const handleReply = ()=>{
        setModalShow(false)
        axios.post(axios.post('https://twitter-7ci7.onrender.com/api/posts',{ tweetContent:tweetContent, token:token, replyTo:currentTweet._id }))
        .then(res=>{
            console.log(res.data)
            handleSendNotification("reply")
        })
    }

    const showReplyModal = (e)=>{
        setModalShow(true);
    }

    const handlePin = ()=>{
        axios.put("https://twitter-7ci7.onrender.com/api/user/pintweet",{},{
            params:{
                userId:currentTweet.postedBy._id,
                tweetId: currentTweet._id,
                isPinned: currentTweet.postedBy.pinned.includes(currentTweet._id)
            }
        })
        .then(res=>{
            window.location.reload()
        })
    }

    const handleSendNotification = (type)=>{
        if(currentTweet.postedBy._id === user._id)return
        let notificationData = {
            userTo:currentTweet.postedBy._id,
            userFrom:user.id,
            notificationType:type,
            opened:false,
            entityId:currentTweet._id
        }
        socket.emit("new notification",notificationData)
    }

    return (
        <>
            {modalShow?
                <Modal show={modalShow} onHide={() => {
                    setModalShow(false)
                    setTweetContent("")
                    }}>
                    <Modal.Header className="reply-modal-header" closeVariant="white" closeLabel="" closeButton>
                        
                    </Modal.Header>
                    <Modal.Body>
                        <div className="Main-Tweet-container">
                            <div className="Tweet-Content-wrapper">
                            <img className="Tweet-profile-pic home-user-pic" 
                            src={currentTweet.postedBy&&currentTweet.postedBy.profilePic!==defPicLink?
                            `https://twitter-7ci7.onrender.com/api/user/profilepic/${currentTweet.postedBy.profilePic}`:
                            defPicLink
                            }
                            alt="Profile Pic"/>
                                <div className="content-container">
                                    <div className="Tweet-header">
                                        <Link href={`/profile/${currentTweet.postedBy.username}`} style={{textDecoration:"none",color:"black"}}>
                                            <p className="tweet-name">
                                                {currentTweet.postedBy.FirstName} {currentTweet.postedBy.LastName}
                                            </p>
                                        </Link>                        
                                        <p className="tweet-username">
                                            @{currentTweet.postedBy.username} 
                                        </p>                        
                                        <p className="tweet-username">
                                            <ReactTimeAgo date={currentTweet.createdAt} timeStyle="twitter"/>
                                        </p>
                                    </div>
                                    <div className="Tweet-content">
                                        <p className="Tweet-content-text">
                                            {currentTweet.content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="home-tweet-container" style={{padding:"7px"}}>
                            <img 
                            src={currentTweet.postedBy&&currentTweet.postedBy.profilePic!=={defPicLink}?
                            `https://twitter-7ci7.onrender.com/api/user/profilepic/${user.profilepic}`:
                            defPicLink
                            }
                            className="home-user-pic" alt="Profile Pic"/>
                            <div className="home-tweet-inner-container">
                                <textarea className="home-tweet-textarea" value={tweetContent} onChange={handleChange} placeholder="What's happening?">

                                </textarea>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleReply} id="tweet-submit-btn" variant="primary" className="home-tweet-btn" disabled={isBtnActive}>Tweet</Button>
                    </Modal.Footer>
                </Modal>:
                null
            }
            <div className="Main-Tweet-container">
                <div className="is-retweet d-flex justify-content-start align-items-center mx-5"> 
                {
                    props.isProfile&&currentTweet.postedBy._id===user.id&&!isRetweet?currentTweet.postedBy.pinned.includes(currentTweet._id)?
                    <><PinFill onClick={handlePin} size={18}/><span>Pinned by {currentTweet.postedBy.FirstName} {currentTweet.postedBy.LastName}</span></>:
                    <Pin onClick={handlePin} size={18}/>:null
                }
                {isRetweet?
                    <div className="is-retweet d-flex justify-content-start align-items-center w-50">
                        <ArrowRepeat color="#9aa7b1"/>
                        <span style={{color:"#9aa7b1"}}>
                            {' '}{rtPostedby.FirstName}{' '}{rtPostedby.LastName} Retweeted
                        </span>
                    </div>
                :null}
                </div>
                <div className="Tweet-Content-wrapper">
                    <img className="Tweet-profile-pic home-user-pic" 
                        src={currentTweet.postedBy&&currentTweet.postedBy.profilePic!=='https://res.cloudinary.com/kunalbarve/image/upload/v1629434967/TwitterClone/twitter-avi-gender-balanced-figure_qc6gdd.png'?
                        `https://twitter-7ci7.onrender.com/api/user/profilepic/${currentTweet.postedBy.profilePic}`:
                        'https://res.cloudinary.com/kunalbarve/image/upload/v1629434967/TwitterClone/twitter-avi-gender-balanced-figure_qc6gdd.png'
                        }  alt="Profile Pic"/>
                    <div className="content-container">
                        <div className="Tweet-header">
                            <Link to={`/profile/${currentTweet.postedBy._id}`} style={{textDecoration:"none",color:"black"}}>
                                <p className="tweet-name">
                                    {currentTweet.postedBy.FirstName} {currentTweet.postedBy.LastName}
                                </p>
                            </Link>                        
                            <p className="tweet-username">
                                @{currentTweet.postedBy.username} 
                            </p>                        
                            <p className="tweet-username">
                                <ReactTimeAgo date={currentTweet.createdAt} timeStyle="twitter"/>
                            </p>
                        </div>
                        {
                            currentTweet.replyTo?<><Link style={{color:"initial",textDecoration:"none"}} to={`/profile/${currentTweet.postedBy._id}`}>
                                <p className="tweet-username mx-5">replying to <span className="reply-username"> @{currentTweet.postedBy.username} </span></p>
                            </Link> 
                            </>:null
                        }
                        <Link to={`/tweet/${currentTweet._id}`} style={{color:"initial",textDecoration:"none"}}>
                            <div className="Tweet-content">
                                <p className="Tweet-content-text">
                                    {currentTweet.content}
                                </p>
                            </div>
                        </Link>
                        <div className="Tweet-footer">
                            <div className="like-btn-container reply-btn">
                                <Chat onClick={()=>{showReplyModal()}} className="tweet-footer-btn" size={20}/>
                                <span style={{color:'#AA9590'}}>{ currentTweet.replies.length >0 ? currentTweet.replies.length : null}</span>
                            </div>
                            <div className="like-btn-container rt-btn">
                                {currentTweet.retweetUsers.includes(user.id)?<ArrowRepeat onClick={handleRetweet} className="tweet-footer-btn" color="#19cf86" size={20}/>:
                                <ArrowRepeat onClick={handleRetweet} className="tweet-footer-btn" color="#AA9590" size={20}/>}
                                <span style={{color:currentTweet.retweetUsers.includes(user.id)? '#19cf86': '#AA9590'}}>{ currentTweet.retweetUsers.length >0 ? currentTweet.retweetUsers.length : null}</span>
                            </div>
                            
                            <div className="like-btn-container" style={{color:currentTweet.likes.includes(user.id)? '#F91880': '#AA9590'}}>  
                                { currentTweet.likes.includes(user.id)?<HeartFill onClick={handleLike} color={"#f91880"} className="tweet-footer-btn like-btn" size={20}/>:
                                <Heart onClick={handleLike} className="tweet-footer-btn like-btn" size={20}/>}
                                <span>{ currentTweet.likes.length >0 ? currentTweet.likes.length : null}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Tweet