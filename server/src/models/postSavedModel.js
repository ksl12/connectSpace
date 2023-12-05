import { connection } from "../config/environment.js";

export const getTotalPS = async (userID) => {
    let q = `SELECT ps.*, p.*, i.*, u.avatar, u.user_ID, u.firstName, u.lastName FROM post_saved AS ps 
            JOIN post AS p ON (ps.post_ID = p.post_ID)
            LEFT JOIN image AS i ON (p.post_ID = i.imagePost_ID)
            JOIN user AS u ON (u.user_ID = p.postUser_ID)
            WHERE ps.user_ID = ?`
    let res = await connection.query(q, [userID], (err) => {
        return err
    })
    return res[0]
}

export const addPS = async (value) => {
    let q = "INSERT INTO post_saved (`user_ID`, `post_ID`) VALUES (?)"
    let res = await connection.query(q, [value], (err) => {
        return err
    })
    return res[0]
}

export const deletePS = async (userID, postID) => {
    let q = "DELETE FROM post_saved WHERE `user_ID` = ? AND `post_ID` = ?"
    let res = await connection.query(q, [userID, postID], (err) => {
        return err
    })
    return res[0]
}

