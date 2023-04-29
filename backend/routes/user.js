const BookedRoom = require("../model/bookedRoom");
const Room = require('../model/room')
const User = require('../model/user')
const route = require('express').Router()

route.get('/roomBooking',async (req,res)=>{
    const availableRooms = await BookedRoom.find()
    res.json(availableRooms)
})
route.get('/pastBooking',async (req,res)=>{
    const allUsers = await User.find()
    const date = new Date().toISOString().slice(0,10)
    const cdArr = date.split('-');
    const resultedUsers = allUsers.filter((obj)=>{
        const objDateArr = obj.startTime.split('-')
        if(objDateArr[1] < cdArr[1]){
            return obj
        }else if(objDateArr[1] === cdArr[1]){
            if(objDateArr[2]<cdArr[2]){
                return obj
            }
        }
    })
    res.json(resultedUsers)
})
route.get('/upcomingBooking',async (req,res)=>{
    const allUsers = await User.find()
    const date = new Date().toISOString().slice(0,10)
    const cdArr = date.split('-');
    const resultedUsers = allUsers.filter((obj)=>{
        const objDateArr = obj.startTime.split('-')
        if(objDateArr[1] > cdArr[1]){
            return obj
        }else if(objDateArr[1] === cdArr[1]){
            if(objDateArr[2]>cdArr[2]){
                return obj
            }
        }
    })
    res.json(resultedUsers)
})


const isBooked = async (startDate,endDate,roomNo)=>{
    const bookedDateList = []
    const sdArr = startDate.split('-')
    const edArr = endDate.split('-')
    let n = edArr[2]-sdArr[2];
    if(edArr[1]!==sdArr[1]){
        let num = sdArr[2]-1;
        if(sdArr[1] == 1|| sdArr[1] == 3|| sdArr[1] == 5|| sdArr[1] == 7|| sdArr[1] == 8|| sdArr[1] == 10|| sdArr[1] == 12){
            while(num!=(edArr[2]-1)){
                tmp = sdArr[0]+'-'+`0${sdArr[1]}`.slice(-2)+'-'+`0${++num}`.slice(-2)
                if(num == 31){
                    num = 0
                    sdArr[1]++;
                }
                bookedDateList.push(tmp)
            }

        }else{
            while(num!=(edArr[2]-1)){
                tmp = sdArr[0]+'-'+`0${sdArr[1]}`.slice(-2)+'-'+`0${num++}`.slice(-2)
                if(num == 30){
                    num = 1
                    sdArr[1]++;
                }
                bookedDateList.push(tmp)
            }
        }
    }else{
        let num = sdArr[2];
        for(let i = 0;i<n;i++){
            let tmp = (`${sdArr[0]}-${sdArr[1]}-${num++}`)
            bookedDateList.push(tmp)
        }
    }
    //------------------
    const choosedRoom = await BookedRoom.findOne({roomNo:roomNo})
    console.log(choosedRoom)
    if(choosedRoom){
        for(let date1 of bookedDateList){
            for(let date2 of choosedRoom.bookedDate || []){
                if(date1 === date2){
                    return {bookedDateList,dateIsBooked:true}
                }
            }
        }
    }
    return {bookedDateList,dateIsBooked:false}
}

route.post('/roomBooking',async(req,res)=>{
    const {email,startTime,endTime,roomType,paymentMode,roomNo} = req.body
    const {bookedDateList,dateIsBooked} = await isBooked(startTime,endTime,roomNo)
    if(!dateIsBooked){
        const bookRoom = await BookedRoom.findOneAndUpdate({roomNo:roomNo},{
            $push:{
                bookedDate: {
                    $each:bookedDateList
                }
            }
        })
        const user = new User({
            email,startTime,endTime,roomType,paymentMode,roomNo,amount:(bookRoom.price * bookedDateList.length)
        })
        await user.save()
        res.json({message:'room booked',user})
    }
    else{
        res.json({message:'date already booked'})
    }
})

route.put('/updateUser',async (req,res)=>{
    const {email,startTime,endTime,roomType,paymentMode,roomNo,amount,_id} = req.body
    const user = await User.findOne({_id:_id})
    console.log("user",user)

    const {bookedDateList,dateIsBooked} = await isBooked(startTime,endTime,roomNo)
    if(dateIsBooked){
        res.json({message:"can't update, room already booked"})
    }else{
        const {bookedDateList:previousBookingDates} = await isBooked(user.startTime,user.endTime,user.roomNo)
        let updateRoom = await BookedRoom.findOne({roomNo:roomNo})
        for(let date1 of updateRoom.bookedDate){
            for(let date2 of previousBookingDates){
                if(date1 === date2){
                    let idx = updateRoom.bookedDate.indexOf(date1)
                    updateRoom.bookedDate.splice(idx)
                }
            }
        }
        await updateRoom.save()
        const updatedRoom = await BookedRoom.updateOne({roomNo:roomNo},{
            $push:{
                bookedDate: {
                    $each:bookedDateList
                }
            }
        },
            {new:true}
        )

        // await updatedRoom.save();
        const updatedObj = await User.findOneAndUpdate(
            {_id:req.body._id},
            {...req.body,amount:(updateRoom.price * bookedDateList.length)}
            ,{new:true})
        res.json({message:"updated",user:updatedObj})
    }
})


route.delete('/cancelBooking',async (req,res)=>{
    const user = await User.findById(req.body._id)
    const { startTime,endTime, amount,roomNo } = user
    const sdArr = startTime.split('-');
    const date = new Date().toISOString().slice(0,10)
    const cdArr = date.split('-');

    const {bookedDateList:cancelDates} = await isBooked(startTime,endTime,roomNo)
    const choosedRoom = await BookedRoom.findOne({roomNo:roomNo})
    for(let date1 of choosedRoom.bookedDate){
        for(let date2 of cancelDates){
            if(date1 === date2){
                let idx = cancelDates.indexOf(date1)
                choosedRoom.bookedDate.splice(idx)
            }
        }
    }
    await choosedRoom.save()
    let refundedAmount = 0;
    if(sdArr[1]===cdArr[1]){
        const diff = sdArr[2] - cdArr[2]
        if(diff===2){
            refundedAmount = amount/2;
        }else if(diff>2){
            refundedAmount = amount
        }
    }
    const removeUser = await User.findByIdAndDelete(req.body._id)
    res.json({refundedAmount})
})
module.exports = route