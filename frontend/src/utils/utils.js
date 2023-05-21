import axios from 'axios'

const SERVER_URL =
  process.env.SERVER_URL || 'https://hmadmin-server.onrender.com'

export const createRoom = async (roomType, roomNo, price) => {
  const data = await axios.post(`${SERVER_URL}/admin/createRoom`)
  return data
}

export const upcomingBooking = async () => {
  const rooms = await axios.get(`${SERVER_URL}/user/upcomingBooking`)
  return rooms
}

export const pastBooking = async () => {
  const rooms = await axios.get(`${SERVER_URL}/user/pastBooking`)
  return rooms
}

export const cancelBooking = async _id => {
  const cancelBooking = await axios.delete(
    `${SERVER_URL}/user/cancelBooking/${_id}`
  )
  return cancelBooking
}

export const updateUser = async (
  email,
  startDate,
  endDate,
  roomType,
  roomNo,
  _id
) => {
  const updatedUser = await axios.put(`${SERVER_URL}/user/updateUser`, {
    email,
    startDate,
    endDate,
    roomType,
    roomNo,
    _id
  })
  return updatedUser
}

export const getAllRooms = async () => {
  const allRooms = await axios.get(`${SERVER_URL}/admin/allRooms`)
  return allRooms
}

export const bookARoom = async (
  email,
  startDate,
  endDate,
  roomType,
  roomNo,
  paymentMode
) => {
  const roomBookingData = await axios.post(`${SERVER_URL}/user/roomBooking`, {
    startDate,
    endDate,
    roomType,
    roomNo,
    paymentMode
  })
  return roomBookingData
}
