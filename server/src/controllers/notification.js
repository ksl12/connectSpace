import { getAllNotification, getNotification, readAllNotification, readNotification } from "../models/notificationModel.js"


const getNumberNoti = async (req, res) => {
    try {
        let user_ID = req.params.userID
        let noti = await getNotification(user_ID)
        return res.status(200).json(noti)
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

const getAllNoti = async (req, res) => {
    try {
        let user_ID = req.params.userID
        let noti = await getAllNotification(user_ID)
        return res.status(200).json(noti)
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}


const readNoti = async (req, res) => {
    try {
        let notification_ID = req.params.notificationID
        let noti = await readNotification(notification_ID)
        if(noti.changedRows > 0) {
            return res.status(200).json("Read noti successful")
        } 
        else {
            return res.status(200).json("Noti is readed")
        }
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

const readAllNoti = async (req, res) => {
    try {
        let user_ID = req.params.userID
        let noti = await readAllNotification(user_ID)
        if(noti.changedRows > 0) {
            return res.status(200).json("Read all noti successful")
        } 
        else {
            return res.status(200).json("Some error or all noti is readed")
        }
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

export const notiCtrl = {
    getNumberNoti,
    getAllNoti,
    readNoti,
    readAllNoti
}