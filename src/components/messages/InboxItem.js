import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './InboxItem.css'

function InboxItem(props) {

    let ssUser = sessionStorage.getItem('user')
    ssUser = JSON.parse(ssUser)

    let [ chat, setChat ] = useState(props.chat)
    let chatname=""
    let images = []

    if(!chat.chatName)
    {
        chat.users.map((user,id) =>
            {
                if(user._id !== ssUser.id)
                {
                    if(images.length<2)
                    {
                        images.push(user)
                    }
                    chatname = chatname+" "+user.FirstName+" "+user.LastName
                }
            }
        )
    }

    else 
    {
        chatname=chat.chatName    
        chat.users.map((user,id) =>
            {
                if(user._id !== ssUser.id)
                {
                    if(images.length<2)
                    {
                        images.push(user)}
                }
            }
        )
    }

    console.log(chat)

    return (
        <Link to={`/messages/chat/${chat._id}`} className="inbox-item-link">
            <div className={images.length>1?"inbox-item-images-group-container":"inbox-item-images-single-container"}>
                {
                    images.map((user,id)=>(
                        <div>
                            <img className={images.length>1?id==0?"group-img first-img":"group-img":"single-img"}
                            src={user.profilePic && user.profilePic!=='https://res.cloudinary.com/kunalbarve/image/upload/v1629434967/TwitterClone/twitter-avi-gender-balanced-figure_qc6gdd.png'?
                            `https://twitter-7ci7.onrender.com/api/user/profilepic/${user.profilePic}`:'https://res.cloudinary.com/kunalbarve/image/upload/v1629434967/TwitterClone/twitter-avi-gender-balanced-figure_qc6gdd.png'
                            } alt="profile pic"/>
                        </div>
                    ) )
                }
            </div>
            <div className="inbox-item-container">
                <p className="inbox-chat-name">
                    {chatname}
                </p>
                <p className="inbox-chat-latest-msg">
                    {chat.latestMessage&&chat.latestMessage.sender? chat.latestMessage.sender.FirstName + " " + chat.latestMessage.sender.LastName +" : " + chat.latestMessage.content : null}
                </p>
            </div>
        </Link>
    )
}

export default InboxItem
