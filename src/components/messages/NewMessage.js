import axios from 'axios'
import React, { useRef, useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Search as TweetSearch, X } from 'react-bootstrap-icons'
import User from '../Profile/User'
import './NewMessage.css'

function NewMessage(props) {

    let [ searchText, setSearchText ] = useState("")
    let [ isBtnDisabled, setIsBtnDisabled ] = useState(true)
    let [ users, setUsers ] = useState([])
    let [ selectedUsers, setSelectedUsers ] = useState([])

    let searchRef = useRef()

    let ssUser = sessionStorage.getItem('user')
    ssUser = JSON.parse(ssUser)

    const handleSearch = (e)=>{
        setSearchText(e.target.value)
        if(
            e.target.value !==""
        )
        {
            axios.get("https://twitter-7ci7.onrender.com/api/user/search",{
                params:{
                    search : e.target.value
                }
            })
            .then(res=>{
                console.log(res.data)
                setUsers(res.data)
            })
            .catch((err)=>{console.log(err)})
        }
        else {
            setUsers([])    
        }
    }

    const handleSelect = (user)=>{
        console.log(user)
        setSelectedUsers([...selectedUsers,user])
        setIsBtnDisabled(false)
        setSearchText("")
        setUsers([])
        searchRef.current.focus()
    }

    const handleDeselect = (id)=>{
        const temp = [...selectedUsers];
        console.log(temp)
        temp.splice(id, 1);
        console.log(temp)
        setSelectedUsers(temp)
        if (selectedUsers.length === 2)  console.log(selectedUsers)
    }

    const handleCreateChat = ()=>{
        axios.post("https://twitter-7ci7.onrender.com/api/chat/create",{
            users:selectedUsers,
            userId:ssUser.id
        })
        .then(res=>{
            console.log(res.data)
            setSelectedUsers([])
            props.onHide()
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    return (
        <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="px-0"
        >
            <Modal.Header closevariant="white" closeLabel=""  className="msg-modal-header d-flex flex-row-reverse" closeButton>
                <Button 
                    onClick={handleCreateChat} disabled={isBtnDisabled || selectedUsers.length===0} 
                    style={{backgroundColor:"#657786",color:"white",fontSize:"15px"}} variant="dark" className="new-chat-header-btn">
                    Next
                </Button>
                <Modal.Title id="contained-modal-title-vcenter" className="mx-auto">
                    New Message
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="new-chat-modal-container">
                    <div className="new-chat-tittle">
                        <TweetSearch className="mr-5" color="#1DA1F2"/>
                        <div className="selected-users-container" >
                        </div>
                        <input ref={searchRef} value={searchText} onChange={handleSearch} className="ml-5 new-chat-search" type="text" placeholder={`Search for people and groups`} />
                    </div>
                    <div className="new-chat-results mt-2" >
                        {selectedUsers.length>0&&<p className="new-chat-result-headers mx-auto">
                            Selected Users
                        </p>}
                        {
                            selectedUsers.length>0&&selectedUsers.map(((user,id)=>(
                                <div className="d-flex align-items-start">
                                    <X size={25} onClick={()=>{handleDeselect(id)}} className="new-chat-close mt-4"/>
                                    <div onClick={()=>{handleSelect(user)}} style={{width:"100%"}}>
                                        <div style={{width:"90%"}}>
                                            <User isChat={true} userData={user}/>
                                        </div>
                                    </div>
                                </div>
                            )))
                        }
                    </div>
                    <div className="new-chat-results mt-2" >
                        {users.length>0&&<p className="new-chat-result-headers mx-auto">
                            Search Results
                        </p>}
                        {
                            users.length>0&&users.map((user=>(
                                user._id===ssUser.id||selectedUsers.some(u=> u._id === user._id)
                                ?null:
                                <div onClick={()=>{handleSelect(user)}} style={{width:"100%"}}><User isChat={true} userData={user}/></div>
                            )))
                        }
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default NewMessage
