import { getOLDPost, addImage, addNewPost, getIDPost, deleteOLDPost, getPostUser, getPostOnly } from "../models/postModel.js"


const getPost = async (req, res) => {
    try {
        let userID = req.params.userID

        let post = await getOLDPost(userID)
        return res.status(200).json(post)
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}


const getPostOnlyUser = async (req, res) => {
    try {
        let userID = req.params.userID

        let post = await getPostUser(userID)
        return res.status(200).json(post)
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

const getOnlyOnePost = async (req, res) => {
    try {
        let postID = req.params.postID
        let post = await getPostOnly(postID)
        return res.status(200).json(post)
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

const addPost = async (req, res) => {
    try {
        const userID = req.body.userID
        const desc = req.body.desc
        const image = req.body.image

        let valuePost = [desc, userID]
        await addNewPost(valuePost)

        if(image) {
            let idPost = await getIDPost(userID)
            let valueImage = [image, idPost[0].post_ID]
            if(image !== undefined) await addImage(valueImage)
        }

        return res.status(200).json({messages: "Add new post successful"})
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

const deletePost = async (req, res) => {
    try {
        let post_ID = req.params.postID
        let result = await deleteOLDPost(post_ID)
        if(result.affectedRows === 0) return res.status(400).json("post has been deleted");
        if(result.affectedRows > 0)return res.status(200).json("Delete post successful!");
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })  
    }
}

export const postCtrl = {
    getPost,
    getPostOnlyUser,
    getOnlyOnePost,
    addPost,
    deletePost
}