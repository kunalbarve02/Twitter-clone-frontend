import React, { useEffect, useRef, useState } from 'react'
import { useParams, useHistory } from 'react-router'
import { ArrowLeftShort, Check2All } from 'react-bootstrap-icons'
import { Overlay, Tooltip } from 'react-bootstrap'
import './Notificationspage.css'
import axios from 'axios'
import Notification from './Notification'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import socket_connection from '../../socket'

function NotificationsPage() {

    let ssUser = sessionStorage.getItem('user')
    ssUser = JSON.parse(ssUser)

    let history = useHistory()

    let [ notis, setNotis ] = useState(null)
    let [ show, setShow ] = useState(false)
    let [ socket, setSocket ] = useState(socket_connection)
    let target = useRef(null)

    useEffect(()=>{
        axios.get('https://twitter-7ci7.onrender.com/api/notis',{
            params:{
                userId:ssUser.id
            }
        })
        .then(res=>{
            console.log(res.data)
            setNotis(res.data)
        })
    },[])

    const handleMarkAll = ()=>{
        axios.put('https://twitter-7ci7.onrender.com/api/notis/markAll',{},{
            params:{
                userId:ssUser.id
            }
        })
        .then(res=>{
            window.location.reload()
        })
    }    

    socket.on('notification recieved',noti=>{
        console.log(noti)
    })

    useDocumentTitle("Notifications")

    return (
        <div style={{minHeight:"100%"}}>
            <div className="home-header d-flex justify-content-between">
                <h1 className="home-header-text"><ArrowLeftShort style={{cursor:"pointer"}} onClick={()=>{history.goBack()}} size={30}/> Notifications</h1>
                <Check2All onMouseEnter={()=>{setShow(true)}} onMouseLeave={()=>{setShow(false)}} ref={target} cursor="pointer" onClick={handleMarkAll} color="#1DA1F2" size={24}/>
            </div>
            {
                notis&&notis.map(noti=>(
                    <Notification set={setNotis} noti={noti} />
                ))
            }
            <Overlay target={target.current} show={show} placement="left">
                {(props) => (
                <Tooltip id="overlay-example" className="mr-3" {...props}>
                    Mark All as Read
                </Tooltip>
                )}
            </Overlay>
        </div>
    )
}

export default NotificationsPage
