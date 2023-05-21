import React, { useEffect, useState } from 'react'
import RoomDetailCard from './RoomDetailCard'
import Loading from '../UI/Loading'
import { getAllRooms } from '../../utils/utils'

function Layout () {
  const [roomsData, setRoomsData] = useState([])
  const [loading, setIsLoading] = useState(false)

  const getRooms = async () => {
    setIsLoading(true)
    const totalRooms = await getAllRooms()
    setIsLoading(false)
    setRoomsData(totalRooms.data)
  }
  useEffect(() => {
    getRooms()
  }, [])

  const roomCardList = roomsData.map(item => (
    <RoomDetailCard key={item._id} item={item} />
  ))

  return <div>{loading ? <Loading /> : roomCardList}</div>
}

export default Layout
