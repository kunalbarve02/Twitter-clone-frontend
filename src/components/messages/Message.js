import React, { useEffect, useRef, useState } from 'react'
import ReactTimeAgo from 'react-time-ago'
import './Message.css'

function Message(props) {


    let ssUser = sessionStorage.getItem('user')
    ssUser = JSON.parse(ssUser)

    let [ message, setMessage ] = useState(props.message)
    let [ nextMessage, setNextMessage ] = useState(props.nextMessage)
    let [ prevMessage, setPrevMessage ] = useState(props.prevMessage)

    let [ isFirst, setIsFirst ] = useState(false)
    let [ isLast, setIsLast ] = useState(false)

    useEffect(()=>{
        if(prevMessage.sender._id !== message.sender._id)
        {
            setIsFirst(true)
        }
        if(nextMessage.sender._id !== message.sender._id)
        {
            setIsLast(true)
        }
        /*if(message._id == props.latestMessage)
        {
            msgRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
            });
        }*/
    },[])

    let msgRef = useRef(null)

    return (
        <>
            {   
                isFirst?
                <p style={props.isMine?{textAlign:"end"}:{textAlign:"left"}} className="sender-name">
                    {message.sender.FirstName+" "+message.sender.LastName}
                </p>:null
            }
            <div className="message-container" style={props.isMine?{flexDirection:"row-reverse"}:{flexDirection:"row"}}>
                <div ref={msgRef} className={props.isMine?isFirst?"message mine first":isLast?"message mine last":"message mine middle":isFirst?"message others first":isLast?"message others last":"message others middle"}>
                    <span className="message-content">
                        {message.content}
                    </span>
                </div>
            </div>
            {
                isLast?
                <div style={props.isMine?{flexDirection:"row-reverse"}:{flexDirection:"row"}} className="sender-img-container">
                    <div className="d-flex flex-column">
                        <img className="sender-img" src={message.sender.profilePic && message.sender.profilePic!==
                            'https://res.cloudinary.com/kunalbarve/image/upload/v1629434967/TwitterClone/twitter-avi-gender-balanced-figure_qc6gdd.png'?
                            `https://twitter-7ci7.onrender.com/api/user/profilepic/${message.sender.profilePic}`:
                            'https://res.cloudinary.com/kunalbarve/image/upload/v1629434967/TwitterClone/twitter-avi-gender-balanced-figure_qc6gdd.png'}
                        />
                        <ReactTimeAgo date={message.createdAt} timeStyle="twitter"/>
                    </div>
                </div>
                :null
            }
        </>
    )
}

export default Message