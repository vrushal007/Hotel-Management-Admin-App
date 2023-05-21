import axios from 'axios'
import React, { useRef, useState } from 'react'
import Button from '../UI/Button'
import {useNavigate, useParams} from 'react-router-dom'
import Modal from '../UI/Modal'
import classes from './AddRoom.module.css'
import Loading from '../UI/Loading'

function EditForm() {
    const [responseData, setResponseData] = useState({})
    const [popupIsShown,setPopupIsShown] = useState(false)
    const [loading,setIsLoading] = useState(false)
    const navigate = useNavigate()
    const {userId} = useParams()
    
    const emailRef = useRef()
    const startDateRef = useRef()
    const endDateRef = useRef()
    const roomTypeRef = useRef()
    const roomNoRef = useRef()
    
    // useEffect(()=>{
    //     const getUser = async () => {
    //         const user = await axios.get('http://localhost:3001/admin/getUser',{
    //             headers:{
    //                 id:userId
    //             }
    //         })
    //         setUser(user.data)
    //     }
    //     getUser()
    // },[userId])
    
    const submitHandler = async (e) => {
        e.preventDefault();
        const email = emailRef.current.value
        const startDate = startDateRef.current.value
        const endDate = endDateRef.current.value
        const dateNow = new Date().toISOString().slice(0, 10)
        const roomNo = roomNoRef.current.value
        const roomType = roomTypeRef.current.value

        if (startDate > dateNow && endDate > startDate) {
            setIsLoading(true)
            const bookRoom = await axios.put('http://localhost:3001/user/updateUser', {
                email, startDate, endDate, roomType, roomNo, _id:userId
            })
            setIsLoading(false)
            setResponseData(bookRoom.data)
        } else if(startDate<dateNow){
            setResponseData({message:"Cannot book previous dates"})
        }else{
            setResponseData({message:"Start date cannot greater than or equal to end date."})
        }
        setPopupIsShown(true)
    }

    const hideHandler = () => {
        setPopupIsShown(false)
    }

    const confirmHandler = ()=>{
        setPopupIsShown(false)
        navigate('/admin')
    }

    return (
        <div className={classes.form}>
            <form>
                <label htmlFor="em">Email of customer</label>
                <input type="email" name='em' ref={emailRef} placeholder="email" required /><br />
                <label htmlFor="room-type">Room Type</label>
                <input type="text" name='room-type' ref={roomTypeRef} placeholder="room-type(A,B,C)" required /><br />
                <label htmlFor="room-no">Room Number</label>
                <input type="text" name='room-no' ref={roomNoRef} placeholder="room-no" required /><br />
                <label htmlFor="s-date">Start Date</label>
                <input type='date' name='s-date' ref={startDateRef} required /><br />
                <label htmlFor="e-date">End Date</label>
                <input type='date' name='e-date' ref={endDateRef} required /><br />
                <Button onClick={submitHandler}>Update Detail</Button>
            </form>
            {popupIsShown && 
            <Modal onHide={hideHandler}>
                {!responseData.user && <p>{responseData.message}</p>}
                {responseData.user &&
                <div>
                    <h3>Congratulations! Your room is updated.</h3>
                    <p>Email : {responseData.user.email}</p>
                    <p>Room No: {responseData.user.roomNo}</p>
                    <p>Start Date: {responseData.user.startDate}</p>
                    <p>End Date: {responseData.user.endDate}</p>
                    <p>Payment Mode: {responseData.user.paymentMode}</p>
                    <p>Total Invoice: {responseData.user.amount}</p>
                    <Button onClick={confirmHandler}>Ok</Button>
                </div>
                }
                {loading && <Loading/>}
                {!responseData.user && <Button onClick={hideHandler}>Ok</Button>}
            </Modal>
            }
        </div>

    )
}

export default EditForm