import React from 'react'
import { useNavigate } from 'react-router-dom'
import img1 from '../../image/img1.jpg'
import Button from '../UI/Button';
import Card from '../UI/Card';
import classes from './RoomDetailCard.module.css'

function RoomDetailCard(props) {
  const navigate = useNavigate()

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(`/booking/${props.item.roomType}/${props.item.roomNo}`)
    // dispatch(roomActions.bookingRoom({
    //   roomType: props.item.roomType,
    //   roomNo: props.item.roomNo,
    //   price: props.item.price
    // }))
    // navigate('/booking')
  }
  return (
    <div className={classes.container} >
      <Card>
        <div>
          <img src={img1} alt="" height='200px'/>
        </div>
        <div className={classes.data}>
          <h1 style={{ fontSize: "24px", color: "#243b7a" }}>Room Type:{props.item.roomType}</h1>
          <h2 style={{ fontSize: "22px", color: "rgb(56 91 188)" }}>Room No:{props.item.roomNo}</h2>
          <h3 style={{ fontSize: "20px", color: "brown" }}>Price:{props.item.price}</h3>
          <Button onClick={submitHandler}>Book Room</Button>
        </div>
      </Card>
    </div>

  )
}

export default RoomDetailCard