import { connection } from "../config/environment.js";

export const getNotification = async (userID) => {
    let q = `SELECT n.*, u.firstName, u.lastName, u.avatar FROM notification AS n JOIN user AS u ON (n.sender_ID = u.user_ID) WHERE receiver_ID = ? ORDER BY createAT DESC LIMIT 3`
    let res = await connection.query(q, [userID], (err) => {
        return err
    })
    return res[0]
}

export const getAllNotification = async (userID) => {
    let q = `SELECT n.*, u.firstName, u.lastName, u.avatar FROM notification AS n JOIN user AS u ON (n.sender_ID = u.user_ID) WHERE receiver_ID = ? ORDER BY createAT DESC`
    let res = await connection.query(q, [userID], (err) => {
        return err
    })
    return res[0]
}

export const readNotification = async (notificationID) => {
    let type = 1
    let q = `UPDATE notification SET is_read = "${type}" WHERE notification_ID = ?`
    let res = await connection.query(q, [notificationID], (err) => {
        return err
    })
    return res[0]
}

export const readAllNotification = async (userID) => {
    let type = 1
    let q = `UPDATE notification SET is_read = "${type}" WHERE receiver_ID = ?`
    let res = await connection.query(q, [userID], (err) => {
        return err
    })
    return res[0]
}

export const addNotification = async (value) => {
    let q = "INSERT INTO notification (`sender_ID`, `receiver_ID`, `notification_message`) VALUES (?)"
    let res = await connection.query(q, [value], (err) => {
        return err
    })
    return res[0]
}

export const deleteNotification = async (notificationID) => {
    let q = "DELETE FROM notification WHERE `notification_ID` = ?"
    let res = await connection.query(q, [notificationID], (err) => {
        return err
    })
    return res[0]
}

