import axios from 'axios'
import React, {useRef, useState} from 'react'
import Button from '../UI/Button';
import classes from './AddRoom.module.css'
import Loading from '../UI/Loading'
import {useNavigate} from 'react-router-dom';

function AddRoom() {
    const[message,setMessage] = useState("");
    const [loading,setIsLoading] = useState(false)
    const roomTypeRef = useRef()
    const roomNoRef = useRef()
    const priceRef = useRef()
    const navigate = useNavigate()
    
    const submitHandler = async(e)=>{
        e.preventDefault();
        try{
            setIsLoading(true)
            await axios.post('http://localhost:3001/admin/createBookRoom',{
                roomType:roomTypeRef.current.value,
                roomNo:roomNoRef.current.value,
                price:priceRef.current.value
            })
            setIsLoading(false)
            setMessage("room created")
            navigate('/')
        }
        catch(err){
            setMessage("Creation failed")
        }
    }

  return (
    <div className={classes.form}>
        <form>
        <input type="text" placeholder='roomType' ref={roomTypeRef}/>
        <input type="text" placeholder='roomNo' ref={roomNoRef}/>
        <input type="number" placeholder='price' ref={priceRef}/><br /><br />
        <Button onClick={submitHandler}>Create Room</Button>
        {loading && <Loading />}
        {message}
        </form>
        
    </div>
  )
}

export default AddRoom