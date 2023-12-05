import { connection } from "../config/environment.js";

export const getNumberComment = async (postID) => {
    let q = "SELECT COUNT(*) AS numberComment FROM comment WHERE post_ID = ?"
    let res = await connection.query(q, [postID], (err) => {
        return err
    })
    return res[0]
}

export const getComment = async (postID) => {
    let q = `SELECT c.*, u.user_ID, u.firstName, u.lastName, u.avatar FROM comment AS c 
    JOIN user AS u ON (u.user_ID = c.user_ID) 
    WHERE c.post_ID = ?
    ORDER BY c.createAT DESC`
    let res = await connection.query(q, [postID], (err) => {
        return err
    })
    return res[0]
}

export const addComment = async (value) => {
    let q = "INSERT INTO comment (`user_ID`, `post_ID`, `comment_content`, `parent_comment_ID`) VALUES (?)"
    let res = await connection.query(q, [value], (err) => {
        return err
    })
    return res[0]
}

export const deleteOLDComment = async (commentID, userID) => {
    let q = "DELETE FROM comment WHERE `comment_ID` = ? AND `user_ID` = ?"
    let res = await connection.query(q, [commentID, userID], (err, data) => {
        return err
    })
    return res[0]
}

// get new comment from monday to current day
export const getAddWeekComment = async () => {
    let q = `SELECT  COUNT(*) AS new_comment_this_week FROM comment AS c
            WHERE YEARWEEK(c.CreateAT, 3) = YEARWEEK(CURDATE(), 3) AND WEEKDAY(c.CreateAT) <= WEEKDAY(CURDATE())`
    let res = await connection.query(q)
    return res[0][0].new_comment_this_week
}

// get new comment is created from monday to sunday last week

export const getCommentLastWeek = async () => {
    let q = `SELECT COUNT(*) AS new_comment_last_week FROM comment AS c
            WHERE (WEEK(c.CreateAT, 3) = WEEK(CURDATE(), 3) - 1 AND YEAR(c.CreateAT) = YEAR(CURDATE()))`
    let res = await connection.query(q)
    return res[0][0].new_comment_last_week
}