import { connection } from "../config/environment.js";

export const getTotalNumberFriend = async (userID) => {
    let type = "friend"
    let q = `SELECT COUNT(*) AS numberFriend FROM friend AS f WHERE (f.user_first_ID = ? AND f.type = "${type}") OR (f.user_sec_ID = ? AND f.type = "${type}")`
    let res = await connection.query(q, [userID, userID], (err) => {
        return err
    })
    return res[0]
}


export const getTotalFriend = async (userID, limit, size) => {
    let type = "friend"
    let q = `(SELECT u.user_ID, u.firstName, u.lastName, u.avatar FROM friend AS f 
            JOIN user AS u ON (f.user_sec_ID = u.user_ID)
            WHERE f.user_first_ID = ? AND f.type = "${type}"
            UNION
            SELECT u.user_ID, u.firstName, u.lastName, u.avatar FROM friend AS f 
            JOIN user AS u ON (f.user_first_ID = u.user_ID)
            WHERE f.user_sec_ID = ? AND f.type = "${type}") LIMIT ? OFFSET ?`
    let res = await connection.query(q, [userID, userID, limit, size], (err) => {
        return err
    })
    return res[0]
}

export const isFriend = async (userID, friendID) => {
    let q = "SELECT * FROM friend AS f WHERE (f.user_first_ID = ? AND f.user_sec_ID = ?) OR (f.user_sec_ID = ? AND f.user_first_ID = ?)"
    let res = await connection.query(q, [userID, friendID, userID, friendID], (err) => {
        return err
    })
    return res[0]
}

// check this user that has send request for other user or not
export const isSendRequest = async (userID) => {
    let type = "PENDING"
    let q = `SELECT * FROM friend_invitation WHERE send_user_ID = ? AND type = "${type}"`
    let res = await connection.query(q, [userID], (err) => {
        return err
    })
    return res[0]
}

// check this user that has receive request from other user or not
export const isReceiveRequest = async (userID) => {
    let type = "PENDING"
    let q = `SELECT * FROM friend_invitation WHERE receive_user_ID = ? AND type = "${type}"`
    let res = await connection.query(q, [userID], (err) => {
        return err
    })
    return res[0]
}

export const sendRequest = async (value) => {
    let q = "INSERT INTO friend_invitation (`send_user_ID`, `receive_user_ID`) VALUES (?)"
    let res = await connection.query(q, [value], (err) => {
        return err
    })
    return res[0]
}

export const acceptRequest = async (userID, receiveID) => {
    let type = "ACCEPTED"
    let q = `UPDATE friend_invitation SET type = "${type}" WHERE send_user_ID = ? AND receive_user_ID = ?`
    let res = await connection.query(q, [userID, receiveID], (err) => {
        return err
    })
    return res[0]
}

export const rejectRequest = async (userID, receiveID) => {
    let q = `DELETE FROM friend_invitation WHERE send_user_ID = ? AND receive_user_ID = ?`
    let res = await connection.query(q, [userID, receiveID], (err) => {
        return err
    })
    return res[0]
}

export const addNewFriend = async (value) => {
    let q = "INSERT INTO friend (`user_first_ID`, `user_sec_ID`, `type`) VALUES (?)"
    let res = await connection.query(q, [value], (err) => {
        return err
    })
    return res[0]
}


export const deleteOLDFriend = async (userID, friendID) => {
    let q = "DELETE FROM friend AS f WHERE (f.user_first_ID = ? AND f.user_sec_ID = ?) OR (f.user_sec_ID = ? AND f.user_first_ID = ?)" 
    let res = await connection.query(q, [userID, friendID, userID, friendID], (err) => {
        return err
    })
    return res[0]
}

