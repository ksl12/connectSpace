import { addComment, deleteOLDComment, getComment, getNumberComment } from "../models/commentModel.js"


const getNumComment = async (req, res) => {
    try {
        let post_ID = req.params.postID
        let comment = await getNumberComment(post_ID)
        let arrComment = comment.map(item => item.numberComment)
        return res.status(200).json(arrComment)
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

const loadComment = async (req, res) => {
    try {
        let post_ID = req.query.postID
        let comment = await getComment(post_ID)
        return res.status(200).json(comment)
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

const addNewComment = async (req, res) => {
    try {
        let post_ID = req.body.postID
        let user_ID = req.body.userID
        let desc = req.body.desc
        let parentID = req.body.parentID
        let values = [user_ID, post_ID, desc, parentID]

        await addComment(values)
        return res.status(200).json("Add new comment successful")
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

const deleteComment = async (req, res) => {
    try {
        let comment_ID = req.params.commentID
        let user_ID = req.query.userID

        let result = await deleteOLDComment(comment_ID, user_ID)
        if(result.affectedRows === 0) return res.status(400).json("Comment has been deleted");
        if(result.affectedRows > 0)return res.status(200).json("Delete comment successful!");
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
        console.log(error)
    }
}


export const commentCtrl = {
    getNumComment,
    loadComment,
    addNewComment,
    deleteComment
}