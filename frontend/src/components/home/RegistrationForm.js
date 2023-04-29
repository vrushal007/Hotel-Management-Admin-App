import {useRef, useState} from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "./RegistrationForm.css"

const RegistrationForm = (props) => {
    const [responseData,setResponseData] = useState({})

    const roomDetails = useSelector(state=>state.room.bookingRoom)
    const emailRef = useRef()
    const startDateRef = useRef()
    const endDateRef = useRef()
    const paymentModeRef = useRef()

    const submitHandler = async (e)=>{
        e.preventDefault()
        const email = emailRef.current.value
        const roomType = roomDetails.roomType
        const roomNo = roomDetails.roomNo
        const startTime = startDateRef.current.value
        const endTime = endDateRef.current.value
        const paymentMode = paymentModeRef.current.value
        const dateNow = new Date().toISOString().slice(0,10)

        if(startTime>dateNow && endTime > startTime){
            const bookRoom = await axios.post('http://localhost:3001/user/roomBooking',{
                email,startTime,endTime,roomType,roomNo,paymentMode
            })
            setResponseData(bookRoom.data)
        }else{
            setResponseData({message:"Wrong inputs"})
        }
    }

    return (
        <div className="form-main">
            <form >
                <label for="em">Email of customer</label>
                <input type="email" name="em" placeholder="Type Email Id" ref={emailRef} required/><br />
                <label for="room-type">Room Type</label>
                <input type="text" name="room-type" value={roomDetails.roomType} disabled required/><br />
                <label for="room-no">Room Number</label>
                <input type="text" name="room-no" value={roomDetails.roomNo} disabled required/><br />
                <label for="s-date">Starting Date</label>
                <input type='date' name="s-date" ref={startDateRef} required /><br/>
                <label for="e-date">Ending Date</label>
                <input type='date' name="e-date" ref={endDateRef} required/><br/>
                <p>Price per room:{roomDetails.price}</p>
                <label for="pay-method">Payment Method: </label>
                <select name="pay-method" ref={paymentModeRef} required>
                    <option value="online">Online</option>
                    <option value="cash">Cash</option>
                </select><br />
                <p>Click on <b>Book Room</b> to know total price and booking status</p>
                <button onClick={submitHandler}>Book Room</button>
            </form>
            {responseData.message}
            {responseData.user?JSON.stringify(responseData.user):""}
        </div>
    )
}

export default RegistrationForm
