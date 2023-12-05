import { acceptRequest, addNewFriend, deleteOLDFriend, getTotalFriend, getTotalNumberFriend, isFriend, isReceiveRequest, isSendRequest, rejectRequest, sendRequest } from "../models/friendModel.js"


const getNumberFriend = async (req, res) => {
    try {
        let user_ID = req.query.userID
        let count = await getTotalNumberFriend(user_ID, user_ID)
        return res.status(200).json(count)
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

const loadFriend = async (req, res) => {
    try {
        let user_ID = req.query.userID
        let page = req.query.page || 0
        let limit = 12
        let friend = await getTotalFriend(user_ID, limit, page * limit)
        return res.status(200).json(friend)
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
        console.log(error)
    }
}

const checkFriend = async (req, res) => {
    try {
        let user_ID = req.query.userID
        let friend_ID = req.query.friendID
        let checkIsFriend = await isFriend(user_ID, friend_ID)

        return res.status(200).json(checkIsFriend.length)
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

const checkSendRequest = async (req, res) => {
    try {
        let user_ID = req.query.userID
        let checkSend = await isSendRequest(user_ID)

        return res.status(200).json(checkSend)
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

const checkReceiveRequest = async (req, res) => {
    try {
        let user_ID = req.query.userID
        let checkReceive = await isReceiveRequest(user_ID)

        return res.status(200).json(checkReceive)
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}


const sendRequestFriend = async (req, res) => {
    try {
        let send_ID = req.body.userID
        let receive_ID = req.body.receiveID
        let values = [send_ID, receive_ID]
        await sendRequest(values)

        return res.status(200).json("send friend request successful")
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

const acceptFriend = async (req, res) => {
    try {
        let user_ID = req.body.userID
        let receiveID = req.body.receiveID
        let type = "friend"
        let values = [user_ID, receiveID, type]
        await acceptRequest(user_ID, receiveID)
        await addNewFriend(values)
        return res.status(200).json("Accept friend successful")
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

const rejectFriend = async (req, res) => {
    try {
        let user_ID = req.body.userID
        let receiveID = req.body.receiveID
        await rejectRequest(user_ID, receiveID)
        return res.status(200).json("Reject friend successful")
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

const deleteFriend = async (req, res) => {
    try {
        let user_ID = req.body.userID
        let friend_ID = req.body.friendID

        await rejectRequest(user_ID, friend_ID)
        await rejectRequest(friend_ID, user_ID)
        await deleteOLDFriend(user_ID, friend_ID)
        return res.status(200).json("Delete friend successful")
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
        console.log(error)
    }
}


const blockFriend = async (req, res) => {
    try {
        let post_ID = req.query.postID
        let user_ID = req.query.userID

        await unLike(user_ID, post_ID)
        return res.status(200).json("unLike post successful")
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}



export const friendCtrl = {
    getNumberFriend,
    loadFriend,
    checkFriend,
    checkSendRequest,
    checkReceiveRequest,
    sendRequestFriend,
    acceptFriend,
    rejectFriend,
    deleteFriend
}