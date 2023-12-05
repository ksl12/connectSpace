import { connection } from "../config/environment.js";

export const getOLDPost = async (userID) => {
    const typeFriend = "friend"
    let q = `(SELECT p.*, u.user_ID, u.firstName, u.lastName, u.avatar, i.* 
            FROM post AS p 
            LEFT JOIN image AS i ON (i.imagePost_ID = p.post_ID)
            JOIN user AS u ON (u.user_ID = p.postUser_ID) 
            WHERE p.postUser_ID IN (
                SELECT f.user_first_ID
                FROM friend AS f
                WHERE f.user_sec_ID= ? AND f.type = "${typeFriend}"
                UNION
                SELECT f.user_sec_ID
                FROM friend AS f
                WHERE f.user_first_ID = ? AND f.type = "${typeFriend}"
            ) OR p.postUser_ID = ?)
            ORDER BY createAT DESC `
    let res = await connection.query(q, [userID, userID, userID], (err) => {
        return err
    })
    return res[0]
}

export const getPostUser = async (userID) => {
    let q = `(SELECT p.*, u.user_ID, u.firstName, u.lastName, u.avatar, i.* 
            FROM post AS p 
            LEFT JOIN image AS i ON (i.imagePost_ID = p.post_ID)
            JOIN user AS u ON (u.user_ID = p.postUser_ID) 
            WHERE p.postUser_ID = ?)
            ORDER BY createAT DESC `
    let res = await connection.query(q, [userID], (err) => {
        return err
    })
    return res[0]
}

export const getPostOnly = async (postID) => {
    let q = `(SELECT p.*, u.user_ID, u.firstName, u.lastName, u.avatar, i.* 
            FROM post AS p 
            LEFT JOIN image AS i ON (i.imagePost_ID = p.post_ID)
            JOIN user AS u ON (u.user_ID = p.postUser_ID) 
            WHERE p.post_ID = ?)
            ORDER BY createAT DESC `
    let res = await connection.query(q, [postID], (err) => {
        return err
    })
    return res[0]
}


export const getImage = async (postID) => {
    let q = `SELECT * from image WHERE imagePost_ID = ?`
    let res = await connection.query(q, [postID], (err) => {
        return err
    })
    return res[0]
}

export const addImage = async (image) => {
    let q = "INSERT INTO image(`image_URL`, `imagePost_ID`) VALUES (?)"
    let res = await connection.query(q, [image], (err) => {
        return err
    })
    return res[0]
}

export const getIDPost = async (userID) => {
    let q = `SELECT post_ID from post WHERE postUser_ID = ? ORDER BY createAT DESC LIMIT 1`
    let res = await connection.query(q, [userID], (err) => {
        return err
    })
    return res[0]
}


export const addNewPost = async (post) => {
    let q = "INSERT INTO post(`content`, `postUser_ID`) VALUES (?)"
    let res = await connection.query(q, [post], (err) => {
        return err
    })
    return res[0]
}

export const deleteOLDPost = async (postID) => {
    let q = "DELETE FROM post WHERE post_ID = ?"
    let res = await connection.query(q, [postID], (err) => {
        return err
    })
    return res[0]
}

// get new post from monday to current day
export const getAddWeekPost = async () => {
    let q = `SELECT  COUNT(*) AS new_post_this_week FROM post AS p
            WHERE YEARWEEK(p.CreateAT, 3) = YEARWEEK(CURDATE(), 3) AND WEEKDAY(p.CreateAT) <= WEEKDAY(CURDATE())`
    let res = await connection.query(q)
    return res[0][0].new_post_this_week
}

// get new post is created from monday to sunday last week

export const getPostLastWeek = async () => {
    let q = `SELECT COUNT(*) AS new_post_last_week FROM post AS p
            WHERE (WEEK(p.CreateAT, 3) = WEEK(CURDATE(), 3) - 1 AND YEAR(p.CreateAT) = YEAR(CURDATE()))`
    let res = await connection.query(q)
    return res[0][0].new_post_last_week
}

// list post for admin manage post
export const listPostManage = async () => {
    let q = `SELECT p.post_ID, p.content, p.postUser_ID, p.createAT, i.* 
            FROM post AS p
            LEFT JOIN image AS i ON (i.imagePost_ID = p.post_ID)`
    let res = await connection.query(q)
    return res[0]
}