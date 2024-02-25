import React,{ useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import axios from 'axios'
import './User.css'

function User(props) {

    let [ user,setUser ] = useState(props.userData)
    let [ isUnfollow,setIsUnfollow ] = useState(false)

    let ssUser = sessionStorage.getItem('user')
    ssUser = JSON.parse(ssUser)

    const handleFollow = () =>{
        axios.put('https://twitter-7ci7.onrender.com/api/user/follow', {},{
            params:{
                userId : ssUser.id,
                toFollow : user._id
            }
        })
        .then(res=>{
            setUser(res.data)
            console.log(res.data)
        })
        .catch(err=>{
            console.error(err);
        })
    }

    console.log("In user component")
    console.log(user)
    //console.log(ssUser)

    return (
        <div className="main-user-container">
            <div className="user-content-wrapper">
                <div className="user-profilepic-container">
                    <img className="user-pic"  src={user.profilePic && user.profilePic!=='https://res.cloudinary.com/kunalbarve/image/upload/v1629434967/TwitterClone/twitter-avi-gender-balanced-figure_qc6gdd.png'?
                        `https://twitter-7ci7.onrender.com/api/user/profilepic/${user.profilePic}`:
                        'https://res.cloudinary.com/kunalbarve/image/upload/v1629434967/TwitterClone/twitter-avi-gender-balanced-figure_qc6gdd.png'
                        } alt="profilepic"/>
                </div>
                <div className="user-content-container">
                    <div className="user-header">
                        <Link to={`/profile/${user._id}`} style={{textDecoration:"none",color:"black"}}>
                            <p className="user-name">
                                {user.FirstName} {user.LastName}
                            </p>
                        </Link>                        
                        <p className="user-username mx-0">
                            @{user.username} 
                        </p>    
                        <p style={{color:"#14171A"}}>
                            {user.bio}
                        </p>                    
                    </div>
                </div>
                {   
                    props.isChat?
                    null
                    :
                    <>
                        {user && user.followers && user.followers.includes(ssUser.id)?
                        <>
                            {isUnfollow?
                                <Button onClick={handleFollow}
                                onMouseLeave={()=>{
                                    setIsUnfollow(false)
                                }}
                                className="follow w-25" variant="outline-danger"> Unfollow </Button>
                                :
                                <Button onClick={handleFollow} onMouseEnter={()=>{
                                    setIsUnfollow(true)
                                }}
                                className="follow w-25 text-white" variant="primary"> Following </Button>
                            }
                        </>:user._id === ssUser.id?null:
                            <Button onClick={handleFollow} className="follow text-white" variant="primary"> Follow </Button>
                        }
                    </>
                }
            </div>
        </div>
    )
}

export default User
