import axios from 'axios'
import React, { useState } from 'react'
import { PersonFill, Twitter } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import './Notification.css'

function Notification(props) {

    let [ noti , setNoti ] = useState(props.noti)

    const notiText = ()=>{
        if(noti.notificationType === "follow")
        {
            return "started to follow you."
        }
        else if(noti.notificationType === "like")
        {
            return "liked your tweet."
        }
        else if(noti.notificationType === "retweet")
        {
            return "retweeted your tweet."
        }
        else if(noti.notificationType === "reply")
        {
            return "replied to your post."
        }
    }

    const notiUrl = ()=>{
        if(noti.notificationType==="reply"||noti.notificationType==="like"||noti.notificationType==="retweet")
        {
            return `/tweet/${noti.entityId}`
        }
        else if(noti.notificationType==="follow")
        {
            return `/profile/${noti.entityId}`
        }
    }

    const handleOpen = ()=>{
        axios.put('https://twitter-7ci7.onrender.com/api/notis',{},{
            params:{
                notiId:noti._id
            }
        })
        .then(noti=>{
            props.set(noti)
        })
    }

    return (
            <Link onClick={handleOpen} to={notiUrl} className={noti.opened?"noti-item-link":"noti-item-link unread"}>
                <div className="noti-item-images-single-container">
                    {
                        noti.notificationType==="follow"?<PersonFill color="#1DA1F2" size={30}/>:<Twitter color="#1DA1F2" size={30}/>
                    }
                </div>
                <div className="noti-item-container">
                    {
                        <div className="noti-item-images-single-container">
                            <img className={"noti-single-img"} src={noti.userFrom.profilePic && noti.userFrom.profilePic!==
                            'https://res.cloudinary.com/kunalbarve/image/upload/v1629434967/TwitterClone/twitter-avi-gender-balanced-figure_qc6gdd.png'?
                            `https://twitter-7ci7.onrender.com/api/user/profilepic/${noti.userFrom.profilePic}`:
                            'https://res.cloudinary.com/kunalbarve/image/upload/v1629434967/TwitterClone/twitter-avi-gender-balanced-figure_qc6gdd.png'
                            } 
                        alt="profile pic"/>
                        </div>
                    }
                    <p className="noti-name">
                        {noti.userFrom.FirstName}{" "}{noti.userFrom.LastName}
                        <span className="noti-text">
                            {" : "}{notiText()}
                        </span>
                    </p>
                </div>
            </Link>
    )
}

export default Notification
