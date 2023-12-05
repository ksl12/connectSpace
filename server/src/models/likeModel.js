import { connection } from "../config/environment.js";

export const getTotalLike = async (postID) => {
    let q = "SELECT user_ID FROM likepost WHERE post_ID = ?"
    let res = await connection.query(q, [postID], (err) => {
        return err
    })
    return res[0]
}

export const addLike = async (value) => {
    let q = "INSERT INTO likepost (`user_ID`, `post_ID`) VALUES (?)"
    let res = await connection.query(q, [value], (err) => {
        return err
    })
    return res[0]
}

export const unLike = async (userID, postID) => {
    let q = "DELETE FROM likepost WHERE `user_ID` = ? AND `post_ID` = ?"
    let res = await connection.query(q, [userID, postID], (err) => {
        return err
    })
    return res[0]
}

