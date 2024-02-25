import axios from 'axios'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams,useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { Button, Nav, Modal } from 'react-bootstrap'
import { ArrowLeftShort, Envelope, Calendar3, Camera, Twitter } from 'react-bootstrap-icons'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import ReactTimeAgo from 'react-time-ago'
import './Profile.css'
import Tweet from '../Tweet/Tweet'
import useDocumentTitle from '../../hooks/useDocumentTitle'

function Profile() {

    let [ user,setUser ] = useState({})
    let [ navKey,setNavKey ] = useState("tweets")
    let [ tweets,setTweets ] = useState([])
    let [ isUnfollow,setIsUnfollow ] = useState(false)
    let [ isEditing,setIsEditing] = useState(false)
    let [ showCamera,setShowCamera ] = useState(false)
    let [ show, setShow ] = useState(false);
    let [ preview, setPreview ] = useState(null);
    const [ crop, setCrop ] = useState({
        unit: '%',
        width: 50,
        height: 50,
    })
    const [completedCrop,setCompletedCrop] = useState(null)

    let [ showCoverCamera, setShowCoverCamera ] = useState(false)
    let [ coverShow, setCoverShow ] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCoverClose = () => setCoverShow(false);
    const handleCoverShow = () => setCoverShow(true);

    var imageRef = useRef(null)
    var previewCanvasRef = useRef(null);

    let ssUser = sessionStorage.getItem('user')
    ssUser = JSON.parse(ssUser)

    let userId = useParams() 
    let history = useHistory()

    useEffect(()=>{

        if(ssUser === null||ssUser === undefined)
        {
            history.replace("/login")
        }

        axios.get('https://twitter-7ci7.onrender.com/api/profile',{
            params:{
                id:userId.id
            }
        })
        .then(res=>{
            console.log(res.data)
            if(res.status === 400)
            {
                console.log(res.status)
                return alert("User not Found")
            }
            setUser(res.data)
        })
        axios.get('https://twitter-7ci7.onrender.com/api/posts/get/tweets/user', {
            params:{
                id:userId.id
            }
        })
        .then(res=>{
            setTweets(res.data)
        })
    },[userId.id])

    const generateDownload = (canvas, crop) => {
        if (!crop || !canvas) {
            return ;
        }
        

        canvas.toBlob(
            (blob) => {
                let data = new FormData()
                data.append("image" , blob)
                data.append("userId" , ssUser.id)
                console.log(blob)
                console.log(data)
                axios.post('https://twitter-7ci7.onrender.com/api/user/upload/profilepic',data,
                {
                    headers:{
                        processData:false,
                        contentType:blob.type
                    }
                })   
                .then(res=>{
                    window.location.reload()
                }) 
            }
        );
        handleClose()
        imageRef = null
        previewCanvasRef = null
        setPreview(null)
    }

    const generateCoverDownload = (canvas, crop) => {
        if (!crop || !canvas) {
            return ;
        }
        

        canvas.toBlob(
            (blob) => {
                let data = new FormData()
                data.append("image" , blob)
                data.append("userId" , ssUser.id)
                console.log(blob)
                console.log(data)
                axios.post('https://twitter-7ci7.onrender.com/api/user/upload/coverpic',data,
                {
                    headers:{
                        processData:false,
                        contentType:blob.type
                    }
                })   
                .then(res=>{
                    window.location.reload()
                }) 
            }
        );
        handleClose()
        imageRef = null
        previewCanvasRef = null
        setPreview(null)
    }

    useEffect(()=>{
        if (!completedCrop || !previewCanvasRef.current || !imageRef.current) {
            return ;
        }
        const image = imageRef.current;
        const canvas = previewCanvasRef.current;
        const crop = completedCrop;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');
        const pixelRatio = window.devicePixelRatio;

        canvas.width = crop.width * pixelRatio * scaleX;
        canvas.height = crop.height * pixelRatio * scaleY;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY
        );
    },[completedCrop])

    const handleFollow = () =>{
        axios.put('https://twitter-7ci7.onrender.com/api/user/follow', {},{
            params:{
                userId : ssUser.id,
                toFollow : userId.id
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

    const fileHandler = evt => {
        const f = evt.target.files[0];

        if (f) {
            const reader = new FileReader();
            reader.onload = ({ target: { result } }) => {
                setPreview(result);
            };

            reader.readAsDataURL(f); // you can read image file as DataURL like this.
        } else {
            setPreview(null);
        }
    };

    const onLoad = useCallback((img) => 
    {
        imageRef.current = img;
    }, []);

    useDocumentTitle(`${user.FirstName} (@${user.username}) / Twitter`)

    console.log(tweets)
    console.log(user)

    return (
        <>
            <div className="home-header">
                <h1 className="home-header-text"><ArrowLeftShort style={{cursor:"pointer"}} onClick={()=>{history.goBack()}} size={30}/> {user.FirstName} {user.LastName}</h1>
            </div>  
            <div className="profile-header-container">
                <div className="profile-cover-container">
                    <div className="h-100 d-flex justify-content-center align-items-center" onMouseEnter={()=>setShowCoverCamera(true)} onMouseLeave={()=>setShowCoverCamera(false)}>
                        {isEditing && showCoverCamera?<Camera onClick={handleCoverShow} size={50} className="profile-pic-icon"/>:null}
                        {user.coverPic&&user.coverPic!==''?<img className="w-100 h-100"
                        src={
                        `https://twitter-7ci7.onrender.com/api/user/coverpic/${user.coverPic}`
                        } alt="profile pic"/>:null}
                        
                    </div>
                    <div className="profile-profilepic-container" onMouseLeave={()=>{setShowCamera(false)}} >
                        <img className="profile-profilepic" onMouseEnter={()=>{setShowCamera(true)}} 
                        src={user.profilePic && user.profilePic!=='https://res.cloudinary.com/kunalbarve/image/upload/v1629434967/TwitterClone/twitter-avi-gender-balanced-figure_qc6gdd.png'?
                        `https://twitter-7ci7.onrender.com/api/user/profilepic/${user.profilePic}`:'https://res.cloudinary.com/kunalbarve/image/upload/v1629434967/TwitterClone/twitter-avi-gender-balanced-figure_qc6gdd.png'
                        } alt="profile pic"/>
                        {isEditing && showCamera?<Camera onClick={handleShow} size={30} className="profile-pic-icon"/>:null}
                    </div>
                </div>
                <div className="profile-button-container">
                    {   
                        user._id === ssUser.id?
                        
                        <Button className="follow w-25" onClick={()=>{setIsEditing(!isEditing)}} variant="outline-dark" >{isEditing?'Done':'Edit profile'} </Button>:
                        <>
                            {user && user.followers && user.followers.includes(ssUser.id)?
                            <>
                                <Link to={`/messages/chat/${user._id}`}>
                                    <Button className="msg-btn d-flex align-items-center" variant="outline-light"><Envelope color="#657786" size={20}/></Button>
                                </Link>
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
                            </>:
                                <Button onClick={handleFollow} className="follow" variant="primary"> Follow </Button>
                            }
                        </>
                    }  
                </div>
                <div className="profile-user-details-container">
                    <p className="profile-user-details-name" >
                        {user.FirstName} {user.LastName}
                    </p>
                    <p className="profile-user-details-username">
                        @{user.username}
                    </p>
                    <p style={{color:"#14171A"}} >
                        {user.bio}
                    </p>
                    {user && user.createdAt?
                    <p  className="profile-user-details-username">
                        <Calendar3 size={16}/> joined <ReactTimeAgo date={user.createdAt} timeStyle="twitter-first-minute"/>
                    </p>:null}
                    <div className="profile-user-folower-details" >
                        <Link to={user?`/profile/${user._id}/followinfo`:null} style={{color:"initial",textDecoration:"none"}}>
                            <span>{user && user.following ? user.following.length:0}</span> Following
                        </Link>{' '}
                        <Link to={user?`/profile/${user._id}/followinfo`:null} style={{color:"initial",textDecoration:"none"}}>
                            <span>{user && user.followers ? user.followers.length:0}</span> Followers
                        </Link>
                    </div>
                </div>
            </div>
            <Nav className="justify-content-around mt-4 profile-nav" activeKey={navKey}>
                <Nav.Item>
                    <Nav.Link onClick={()=>{setNavKey("tweets")}} eventKey="tweets" active={navKey === "tweets"}> Tweets </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link onClick={()=>{setNavKey("tweetsandreplies")}} eventKey="tweetsandreplies" active={navKey === "tweetsandreplies"}> Tweets & Replies </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link onClick={()=>{setNavKey("likes")}} eventKey="likes" active={navKey === "likes"}> Likes </Nav.Link>
                </Nav.Item>
            </Nav>
            
            {
                navKey!=='likes'&&user.pinned&&user.pinned.length>0?user.pinned.map((tweet)=>(
                    <><Tweet isProfile={true} key={tweet._id} setUser={setUser} tweetData={tweet} /></>
                )):null
            }

            {
                navKey==='tweets'&& tweets && tweets.length >0?
                tweets.map(tweet=>(
                    tweet.replyTo===undefined||tweet.replyTo===null?<>{
                        user.pinned&&user.pinned.length>0 && tweet.pinnedBy.length>0?null:<><Tweet isProfile={true} setUser={setUser} key={tweet._id} tweetData={tweet}/></>
                    }</>:null
                )):null
            }

            {
                navKey==='tweetsandreplies'&& tweets && tweets.length > 0?
                tweets.map(tweet=>(
                    <><Tweet isProfile={true} isEditable={isEditing} setUser={setUser} key={tweet._id} tweetData={tweet}/></>
                )):null
            }

            {
                navKey==='likes'&& user && user.likes.length >0?
                user.likes.map(tweet=>(
                   <><Tweet key={tweet._id} tweetData={tweet}/></>
                )):null
            }

        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Twitter size={25} className="mx-auto" color="#1DA1F2"/>
            </Modal.Header>
            <Modal.Body>
                <div className="preview-container">
                        {preview?<ReactCrop src={preview} onImageLoaded={onLoad} onComplete={(c) => setCompletedCrop(c)} crop={crop} onChange={newCrop => setCrop(newCrop)} />:<input
                        type="file"
                        accept="image/*"
                        onChange={fileHandler}
                    />}
                </div>
                <canvas
                    className="mx-auto"
                    ref={previewCanvasRef}
                    style={{
                        width: Math.round(completedCrop?.width ?? 0),
                        height: Math.round(completedCrop?.height ?? 0)
                    }}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={()=>{generateDownload(previewCanvasRef.current,crop)}} disabled={!completedCrop?.width || !completedCrop?.height} className="text-white">
                    Upload
                </Button>
            </Modal.Footer>
        </Modal>
        <Modal show={coverShow} onHide={handleCoverClose}>
            <Modal.Header>
                <Twitter size={25} className="mx-auto" color="#1DA1F2"/>
            </Modal.Header>
            <Modal.Body>
                <div className="preview-container">
                        {preview?<ReactCrop src={preview} onImageLoaded={onLoad} onComplete={(c) => setCompletedCrop(c)} crop={crop} onChange={newCrop => setCrop(newCrop)} />:<input
                        type="file"
                        accept="image/*"
                        onChange={fileHandler}
                    />}
                </div>
                <canvas
                    className="mx-auto"
                    ref={previewCanvasRef}
                    style={{
                        width: Math.round(completedCrop?.width ?? 0),
                        height: Math.round(completedCrop?.height ?? 0)
                    }}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCoverClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={()=>{generateCoverDownload(previewCanvasRef.current,crop)}} disabled={!completedCrop?.width || !completedCrop?.height} className="text-white">
                    Upload
                </Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}

export default Profile
