import React, { useEffect, useState } from 'react'
import RoomDetailCard from './RoomDetailCard'
import axios from 'axios'
import Loading from '../UI/Loading';

function Layout() {
    const[roomsData,setRoomsData] = useState([]);
    const [loading,setIsLoading] = useState(false)

    const getAllRooms = async()=>{
        setIsLoading(true)
        const totalRooms = await axios.get('http://localhost:3001/admin/allRooms')
        setIsLoading(false)
        setRoomsData(totalRooms.data)
    }
    useEffect(()=>{
        getAllRooms()
    },[])
    
    const roomCardList = roomsData.map((item)=><RoomDetailCard
        key={item._id}
        item={item}
    />)

  return (
    <div>
        {loading ? <Loading/> : roomCardList}
    </div>
  )
}

export default Layout