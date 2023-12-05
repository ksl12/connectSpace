import { addLike, getTotalLike, unLike } from "../models/likeModel.js"


const getLike = async (req, res) => {
    try {
        let post_ID = req.params.postID
        let like = await getTotalLike(post_ID)
        let arrLike = like.map(item => item.user_ID)
        return res.status(200).json(arrLike)
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

const addNewLike = async (req, res) => {
    try {
        let post_ID = req.body.postID
        let user_ID = req.body.userID
        let values = [user_ID, post_ID]

        await addLike(values)
        return res.status(200).json("Like post successful")
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

const unLikePost = async (req, res) => {
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


export const likeCtrl = {
    getLike,
    addNewLike,
    unLikePost
}