import React, { useEffect, useState } from 'react'
import { ArrowLeftShort, PersonPlus } from 'react-bootstrap-icons'
import { useHistory } from 'react-router'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import NewMessage from './NewMessage'
import './Messages.css'
import axios from 'axios'
import InboxItem from './InboxItem'

function Messages() {

    let history = useHistory()

    let ssUser = sessionStorage.getItem('user')
    ssUser = JSON.parse(ssUser)

    let [ isNewMsg, setisNewMsg ] = useState(false)
    let [ chatList, setChatList ] = useState([])


    useEffect(()=>{
        if(ssUser === null||ssUser === undefined)
        {
            history.replace("/login")
        }
        axios.get("https://twitter-7ci7.onrender.com/api/chat",{
            params:{
                userId:ssUser.id,
            }
        })
        .then(res =>{
            setChatList(res.data)
            console.log(res.data)
        })
        .catch(err=>{
            console.log(err)
        })
    },[])

    useDocumentTitle("Messages / Twitter")

    return (
        <div style={{minHeight:"100vh"}}>
            <div className="home-header d-flex justify-content-between">
                <h1 className="home-header-text"><ArrowLeftShort style={{cursor:"pointer"}} onClick={()=>{history.goBack()}} size={30}/>Messages</h1>
                <PersonPlus style={{cursor:"pointer"}} onClick={()=>{setisNewMsg(true)}} size={30}/>
            </div>
            {
                chatList.map(chat=>(
                    <>
                        <InboxItem chat={chat}/>
                    </>
                )
                )
            }
            <NewMessage show={isNewMsg} onHide={()=>{setisNewMsg(false)}}/>
        </div>
    )
}

export default Messages
