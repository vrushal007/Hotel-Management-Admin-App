import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import Modal from "../UI/Modal";
import Button from "../UI/Button";
import classes from './RegistrationForm.module.css'
import Loading from "../UI/Loading";

const RegistrationForm = (props) => {
    const [roomDetails,setRoomDetails] = useState({})
    const [loading,setIsLoading] = useState(false)

    const navigate = useNavigate();
    const params = useParams()
    
    useEffect(()=>{
            const getRoomData = async () => {
                setIsLoading(true)
                const data = await axios.get('http://localhost:3001/admin/getRoom',{
                    headers:{
                        'roomno': params.roomNo
                    }
                })
                setIsLoading(false)
            setRoomDetails(data.data)
        }
        getRoomData()
    },[params])

    const [responseData,setResponseData] = useState({})
    const [popupIsShown,setPopupIsShown] = useState(false)
    const [amount,setAmount] = useState()


    // const roomDetails = useSelector(state=>state.room.bookingRoom)
    const emailRef = useRef()
    const startDateRef = useRef()
    const endDateRef = useRef()
    const paymentModeRef = useRef()

    const submitHandler = async (e)=>{
        e.preventDefault()
        const email = emailRef.current.value
        const roomType = params.roomType
        const roomNo = params.roomNo
        const startDate = startDateRef.current.value
        const endDate = endDateRef.current.value
        const paymentMode = paymentModeRef.current.value
        const dateNow = new Date().toISOString().slice(0,10)

        if(startDate>dateNow && endDate > startDate){
            setIsLoading(true)
            const bookRoom = await axios.post('http://localhost:3001/user/roomBooking',{
                email,startDate,endDate,roomType,roomNo,paymentMode
            })
            setIsLoading(false)
            // console.log(bookRoom.data)
            setResponseData(bookRoom.data)
        }else if(startDate<dateNow){
            setResponseData({message:"Cannot book previous dates"})
        }else{
            setResponseData({message:"Start date cannot greater than end date."})
        }
        setPopupIsShown(true)
    }

    const hideHandler = (e) => {
        setPopupIsShown(false)
    }

    const dateChangeHandler = () => {
        const startDate = new Date(startDateRef.current.value)
        const endDate = new Date(endDateRef.current.value)
        if(startDate < endDate && startDate > new Date()){
            const noOfDays = new Date(endDate - startDate).getDate() - 1;
            setAmount(roomDetails.price * noOfDays)
        }
    }

    const confirmHandler = () => {
        navigate('/admin')
    }

    // const bookingData = <div>
    //     <p>Email : {responseData.user.email}</p>
    //     <p>Room No: {responseData.user.roomNo}</p>
    //     <p>Start Date: {responseData.user.startDate}</p>
    //     <p>End Date: {responseData.user.endDate}</p>
    //     <p>Payment Mode: {responseData.user.paymentMode}</p>
    //     <p>Total Invoice: {responseData.user.amount}</p>
    // </div>

    return (
        <div className={classes.form}>
            <form >
                <label htmlFor="em">Email of customer</label>
                <input type="email" name="em" placeholder="Type Email Id" ref={emailRef} required/>
                <h3>Room Type : {params.roomType}</h3>
                <h3>Room Number : {params.roomNo}</h3>
                <label htmlFor="s-date">Starting Date</label>
                <input type='date' name="s-date" ref={startDateRef} required onChange={dateChangeHandler} />
                <label htmlFor="e-date">Ending Date</label>
                <input type='date' name="e-date" ref={endDateRef} required onChange={dateChangeHandler} />
                <p>Total Amount: {amount}</p>
                <label htmlFor="pay-method">Payment Method:
                <select name="pay-method" ref={paymentModeRef} required>
                    <option value="online">Online</option>
                    <option value="cash">Cash</option>
                </select>
                </label>
                <Button className={classes.button} onClick={submitHandler}>Book Room</Button>
            </form>
           {popupIsShown && 
           <Modal onHide={hideHandler}>
                <p>{responseData.message}</p>
                {responseData.user &&
                <div>
                    <h3>Congratulations! Your room is booked.</h3>
                    <p>Email : {responseData.user.email}</p>
                    <p>Room No: {responseData.user.roomNo}</p>
                    <p>Start Date: {responseData.user.startDate}</p>
                    <p>End Date: {responseData.user.endDate}</p>
                    <p>Payment Mode: {responseData.user.paymentMode}</p>
                    <p>Total Invoice: {responseData.user.amount}</p>
                    <Button onClick={confirmHandler}>Ok</Button>
                </div>
                }
                {!responseData.user && <Button onClick={hideHandler}>Ok</Button>}
                {loading && <Loading />}
            </Modal>
            }
        </div>
    )
}

export default RegistrationForm
