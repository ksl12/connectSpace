import { addPS, deletePS, getTotalPS } from "../models/postSavedModel.js"


const getPS = async (req, res) => {
    try {
        let user_ID = req.params.userID
        let ps = await getTotalPS(user_ID)
        // let arrPS = ps.map(item => item.post_ID)
        return res.status(200).json(ps)
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

const addNewPS = async (req, res) => {
    try {
        let post_ID = req.body.postID
        let user_ID = req.body.userID
        let values = [user_ID, post_ID]

        await addPS(values)
        return res.status(200).json("Save post successful")
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
        console.log(error)
    }
}

const deleteOLDPS = async (req, res) => {
    try {
        let post_ID = req.query.postID
        let user_ID = req.query.userID

        await deletePS(user_ID, post_ID)
        return res.status(200).json("unSave post successful")
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}


export const postSavedCtrl = {
    getPS,
    addNewPS,
    deleteOLDPS
}