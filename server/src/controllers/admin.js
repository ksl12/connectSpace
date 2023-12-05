import { getAddWeekComment, getCommentLastWeek } from "../models/commentModel.js"
import { getAddWeekPost, getPostLastWeek, listPostManage } from "../models/postModel.js"
import { changeBlock, checkBlock, getAddWeekUser, getGender, getUserLastWeek, listUserManage } from "../models/userModel.js"

const checkUserBlocked = async (req, res) => {
    try {
        let userID = req.params.userID
        const type = await checkBlock(userID)
        return res.status(200).json(type)
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

const openBlocked = async (req, res) => {
    try {
        let userID = req.body.userID
        let type = 0
        await changeBlock(type, userID)
        return res.status(200).json("Mở khóa thành công")
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

const Block = async (req, res) => {
    try {
        let userID = req.body.userID
        let type = 1
        await changeBlock(type, userID)
        return res.status(200).json("Khóa thành công")
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}


const listUser = async (req, res) => {
    try {
        const user = await listUserManage()
        return res.status(200).json(user)
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

const listPost = async (req, res) => {
    try {
        const post = await listPostManage()
        return res.status(200).json(post)
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

const getNumberUser = async (req, res) => {
    try {
        let number =  await getAddWeekUser()
        let lastweek = await getUserLastWeek()
        return res.status(200).json({number, lastweek})
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

const getNumberPost = async (req, res) => {
    try {
        let number =  await getAddWeekPost()
        let lastweek = await getPostLastWeek()
        return res.status(200).json({number, lastweek})
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

const getNumberComment = async (req, res) => {
    try {
        let number =  await getAddWeekComment()
        let lastweek = await getCommentLastWeek()
        return res.status(200).json({number, lastweek})
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

const getNumberGender = async (req, res) => {
    try {
        let result =  await getGender()
        const ageGroups = ["13-17", "18-24", "25-34", "35-44", "45-54", "55-64","65+"];
        const genders = ["0", "1", "2"]; // replace with your actual gender values
        const output = {};

        for (const gender of genders) {
            output[gender] = {};
            for (const ageGroup of ageGroups) {
                output[gender][ageGroup] = 0;
            }
        }

        for (const row of result) {
            output[row.gender][row.age_group] = row.count;
        }
        return res.status(200).json({output})
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

export const adminCtrl = {
    openBlocked,
    Block,
    checkUserBlocked,
    listUser,
    listPost,
    getNumberUser,
    getNumberPost,
    getNumberComment,
    getNumberGender
}