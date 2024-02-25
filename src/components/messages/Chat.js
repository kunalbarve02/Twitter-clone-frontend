import axios from 'axios'
import React,{ useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useParams, useHistory } from 'react-router'
import { Cursor, ArrowLeftShort } from 'react-bootstrap-icons'
import { Button, Modal } from 'react-bootstrap'
import { animateScroll } from "react-scroll";
import socket_connection from '../../socket'
import useDocumnetTitle from '../../hooks/useDocumentTitle'
import './Chat.css'
import './InboxItem.css'
import Message from './Message'

function Chat(props) {

    let chatId = useParams()
    let history = useHistory()

    let ssUser = sessionStorage.getItem('user')
    ssUser = JSON.parse(ssUser)
 
    let [ error , setError ] = useState({
        isError:false,
        msg:""
    })
    let [ chat, setChat] = useState({})
    const [show, setShow] = useState(false); 
    const [ changeChatName, setChangeChatName ] = useState("")
    let [ message, setmessage ] = useState("")
    let [isBtnDisabled, setIsBtnDisabled] = useState(true)
    let [ messages, setMessages ] = useState([])
    let [ socket, setSocket ] = useState(socket_connection)
    let [ isTyping, setIsTyping ] = useState(false)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    socket.on("typing",()=>{
        scrollToBottom()
        setIsTyping(true)
        var time = new Date().getTime()
        setTimeout(()=>{
            let latestTime = new Date().getTime()
            if(latestTime>=time) setIsTyping(false)
        },3000)
    })

    socket.on("message recieved", (data)=>{
        alert(true)
        setMessages([...messages,data])
        scrollToBottom()
    })

    const handleChatNameChange = (e)=>
    {
        setChangeChatName(e.target.value)
    }
    const handleChatNameChangeSubmit = (e)=>
    {
        axios.put(`https://twitter-7ci7.onrender.com/api/chat/${chatId.chatid}/changename`,{},{
            params:{
                chatName : changeChatName
            }
        })
        .then(res=>{
            window.location.reload()
            handleClose()
        })
        .catch(error=>{
            console.log(error)
        })
    }

    const scrollToBottom=()=> {
        animateScroll.scrollToBottom({
        containerId: "chat-container"
        });
    }

    const handleMsgTextChange = (e)=>{
        if(e.keyCode == 13 && !e.shiftKey && e.target.value.trim() !== "")
        {
            setmessage("")
            setIsBtnDisabled(true)
            submitMsg()
        }
        else
        {
            setmessage(e.target.value)
            socket.emit("typing",chat._id)
            if(e.target.value.trim() !== "")
            {
                setIsBtnDisabled(false)
            }
        }
    }

    const submitMsg = () =>{
        axios.post('https://twitter-7ci7.onrender.com/api/chat/',{
            content:message,
            chatId:chatId.chatid,
            sender:ssUser.id
        })
        .then(res=>{
            setMessages([...messages, res.data])
            scrollToBottom()
            setIsTyping(false)
            console.log(res.data)
            socket.emit("new message",{message:res.data,users:chat.users})
        })
        setmessage("")
        setIsBtnDisabled(true)
    }

    let chatname=""

    if(!chat.chatName)
    {
        chat && chat.users && chat.users.map((user,id) =>
            {
                if(user._id !== ssUser.id)
                {
                    chatname = chatname + " " + user.FirstName + " " + user.LastName
                }
            }
        )
    }
    else 
    {
        chatname=chat.chatName    
    }

    useEffect(()=>{
        axios.get(`https://twitter-7ci7.onrender.com/api/chat/${chatId.chatid}`,{
        params:{
            userid:ssUser.id
        }
        })
        .then(res => {
            console.log(res.data)
            setChat(res.data.chat)
            setMessages(res.data.messages)
            scrollToBottom()
            socket.emit("join_room", res.data.chat._id)
        })
        .catch(err => {
            console.log(err.message)
             setError(
                {
                    isError:true,
                    msg:err.message
                }
            )
        })
    },[])

    useDocumnetTitle(chatname + " / " + "Twitter" )

    let bottomdiv = useRef(null)

    return (
        <>
            {
                error.isError?
                <>
                    <img 
                    src="https://res.cloudinary.com/kunalbarve/image/upload/v1633500452/download_ued14m.svg"
                    />
                    <p className="mx-5 mb-0">
                        {error.msg}
                    </p>
                </>
                :
                <>
                    <div className="home-header d-flex justify-content-between">
                        <h1 className="home-header-text"><ArrowLeftShort style={{cursor:"pointer"}} onClick={()=>{history.goBack()}} size={30}/>Messages</h1>
                    </div>
                    <div style={{height:"90vh"}} className="chat-parent-container">
                        <div className="chat-name-container"> 
                            <div className="chat-images-container">
                                {
                                    chat.users&&chat.users&&chat.users.length >3 ?
                                    <div className="chat-more-users">
                                        +{chat.users.length - 3}
                                    </div>
                                    :
                                    null
                                }
                                {
                                    chat.users&&chat.users.map((user,idx)=>(
                                        <>
                                            {
                                                user._id!==ssUser.id?
                                                idx<3?
                                                <img key={idx} src={user.profilePic && user.profilePic!==
                                                'https://res.cloudinary.com/kunalbarve/image/upload/v1629434967/TwitterClone/twitter-avi-gender-balanced-figure_qc6gdd.png'?
                                                `https://twitter-7ci7.onrender.com/api/user/profilepic/${user.profilePic}`:
                                                'https://res.cloudinary.com/kunalbarve/image/upload/v1629434967/TwitterClone/twitter-avi-gender-balanced-figure_qc6gdd.png'
                                                } 
                                                alt="profile pic"/>: null
                                                :
                                                null
                                            }
                                        </>
                                    ))
                                }
                            </div>
                            <span onClick={handleShow} className="chat-name" > 
                                {chatname}
                            </span>
                        </div>
                        <div className="main-chat-container">
                            <div className="chat-container" id="chat-container">
                                {
                                    messages && messages.map((message,idx)=>message.sender?
                                    <Message 
                                    key={message._id}
                                    prevMessage = {idx>0?messages[idx-1]:{sender:{id:0}}} 
                                    nextMessage = {idx<messages.length-1?messages[idx+1]:{sender:{id:0}}} 
                                    message={message} 
                                    latestMessage = { chat.latestMessage } 
                                    isMine={message.sender._id===ssUser.id?true:false}/>:null
                                    )
                                }
                                {   
                                    isTyping?
                                    <div className="typing-div">
                                        <img style={{maxWidth:"100%",maxHeight:"100%"}} src={"https://res.cloudinary.com/kunalbarve/image/upload/v1634290899/monophy_jfkltj.gif"} />
                                    </div>
                                    :
                                    null
                                }
                            </div>
                            <div className="chat-footer">
                                <input value={message} onKeyDown={handleMsgTextChange} onChange={handleMsgTextChange} type="text" name="messageInput" placeholder="Start a new Message"/>
                                <Button  disabled={isBtnDisabled} variant="light" className="bg-white" style={{border:"0"}}>
                                    <Cursor onClick={submitMsg} className="send-btn-icon" color={"#1DA1F2"} size={35}/>
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            }
            
        <Modal show={show && chat.isGroupChat === true} onHide={handleClose}>
            <Modal.Header  closevariant="white" closeLabel=""  className="msg-modal-header d-flex flex-row-reverse" closeButton>
            <Modal.Title>Change Chat Name</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input onChange={handleChatNameChange} className="change-chatname" placeholder="Enter New Chat name"/>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary"  className="text-white" onClick={handleChatNameChangeSubmit}>
                Save Changes
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}

export default Chat