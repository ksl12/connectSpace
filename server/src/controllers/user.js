import { findRoleUser, findWithID, findWithName, suggestion, suggestionTwo, updateInfoUser } from "../models/userModel.js" 


const getUser = async (req, res) => {
    try {
        let userID = req.params.userID
        let user = await findWithID("*", userID)
        const {password, ...info} = user[0]
        return res.status(200).json(info)
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

const getInfoUpdate = async (req, res) => {
    try {
        let userID = req.params.userID
        let user = await findWithID("*", userID)
        const role = await findRoleUser(user[0].user_ID)
        const {password, ...info} = user[0]
        return res.status(200).json({
            user: {
                ...info,
                role
            }
        })
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

const updateUser = async (req, res) => {
    try {
        const date = new Date(req.body.dateOFBirth)
        await updateInfoUser(req.body.avatar, req.body.firstName, req.body.lastName,  req.body.email,req.body.phoneNumber, req.body.gender, date, req.params.userID)
        return res.status(200).json({messages: "Update user successful"})
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
        console.log(error)
    }
}


const searchUser = async (req, res) => {
    try {
        const name = req.body.name
        const userID = req.body.userID
        const user = await findWithName(name, userID)
        return res.status(200).json({messages: "Search user successful", user})
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

const suggestionNewFriend = async (req, res) => {
    try {
        let userID = req.params.userID
        let friend = await suggestion(userID)
        let friendTwo = await suggestionTwo(userID)
        let suggestionFriend = [...friend, ...friendTwo]
        return res.status(200).json(suggestionFriend)
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}
export const userCtrl = {
    getUser,
    getInfoUpdate,
    updateUser,
    searchUser,
    suggestionNewFriend
}