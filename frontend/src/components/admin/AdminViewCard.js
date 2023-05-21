import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import img1 from '../../image/img1.jpg'
import Button from '../UI/Button'
import classes from './AdminViewCard.module.css'
import Card from '../UI/Card'
import Modal from '../UI/Modal'
import Loading from '../UI/Loading'
import {cancelBooking} from '../../utils/utils'

function AdminViewCard(props) {
    const { _id } = props.item
    const navigate = useNavigate()
    const [popupIsShown,setPopupIsShown] = useState(false)
    const [refundedAmount,setRefundedAmount] = useState()
    const [loading,setLoading] = useState(false)

    const refundAmountCalc = () => {
        let startDateString = new Date(props.item.startDate)
        let currDateString = new Date()
        let daysLeft = new Date(startDateString-currDateString).getDate() - 1;
        console.log("days left:",daysLeft)
        if(daysLeft <= 4 && daysLeft >= 2){
            setRefundedAmount(props.item.amount/2);
        }else if(daysLeft>4){
            setRefundedAmount(props.item.amount);
        }else{
            setRefundedAmount(0)
        }
    }

    const showHandler = ()=>{
        setPopupIsShown(true)
        refundAmountCalc()
    }

    const hideHandler = ()=>{
        setPopupIsShown(false)
    }

    const onEditHandler = () => {
        navigate(`/editUser/${_id}`)
    }
    const deleteHandler = async () => {
        setLoading(true)
        const cancelled = await cancelBooking(_id)
        console.log("cancelled. Refunded Amount",cancelled.data.refundedAmount)
        setLoading(false)
        setPopupIsShown(false)
        navigate('/admin')
    }
    return (
        <div className={classes.container}>
          <Card>
            <div className={classes.image}>
                <img src={img1} alt="" height='150px' />
            </div>

            <div>
                <p>email: {props.item.email}</p>
                <p>startDate: {props.item.startDate.toLocaleString().slice(0,10)}</p>
                <p>endDate: {props.item.endDate.toLocaleString().slice(0,10)}</p>
                <p>amount: {props.item.amount}</p>
                <p>roomNo: {props.item.roomNo}</p>
                <p>roomType: {props.item.roomType}</p>
                <div className={classes.actions}>
                <Link to={`/editUser/${_id}`}><Button onClick={onEditHandler}>Edit</Button></Link>
                <Button onClick={showHandler}>Delete</Button>
                </div>
                <hr />
            </div>
          </Card>
          {popupIsShown && 
          <Modal onHide={hideHandler}>
              <h2>Are you sure want to delete booking?</h2>
              <h3>Refunded Amount: {refundedAmount} &#x20B9;</h3>
              
              <p>Refund Policy:</p>
              <ol>
                  <li>If 4 or more days left for starting date then full amount will be refunded.</li>
                  <li>If days left is greater than equal to 2 and less than equal to 4 then refunded Amount will be half.</li>
                  <li>If 2 or lesser days left than no refund will be available.</li>
              </ol>
              <div>
                  <Button onClick={deleteHandler}>Confirm</Button>
                  <Button onClick={hideHandler}>Cancel</Button>
              </div>
              
              {loading && <Loading />}
          </Modal>
            }
        </div>
    )
}

export default AdminViewCard