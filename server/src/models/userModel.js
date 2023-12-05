import { connection } from "../config/environment.js";

/**
 * Return ID of a User
 * @param {String} username 
 * @returns 
 */
export const getID = async (username) => {
    let q = "SELECT user_ID FROM user WHERE username = ? LIMIT 1"
    let res = await connection.query(q, [username], (err) => {
        return err
    })
    return res[0]
}

/**
 * Return data is suitable with User_ID
 * @param {type of column data} something 
 * @param {integer} id 
 * @returns 
 */

export const findWithID = async (something, id) => {
    let q = `SELECT ${something} FROM user WHERE user_ID = ? LIMIT 1`
    let res = await connection.query(q, [id], (err) => {
        return err
    })
    return res[0]
}

export const findWithName = async (what, id) => {
    let q = `SELECT user_ID, firstName, lastName, avatar FROM user WHERE LOWER(CONCAT(firstname," ", lastname)) LIKE LOWER(?) AND NOT (user_ID = ?)LIMIT 5`
    let res = await connection.query(q, ["%" + what + "%", id], (err) => {
        return err
    })
    return res[0]
}


/**
 * Check column name is exist
 * e.g username, email
 * @param {columnName} something
 * @param {String} what 
 * @returns 
 */
export const findOne = async (something, what) => {
    let q = `SELECT * FROM user WHERE ${something} = ?`
    let res = await connection.query(q, [what], (err) => {
        return err
    })
    return res[0]
}

/**
 * 
 * @param {string} user_ID
 * @returns 
 */
export const findRoleUser = async (user_ID) => {
    let q = "SELECT role_ID FROM user_role WHERE user_ID = ?"
    let res = await connection.query(q, [user_ID], (err) => {
        return err
    })
    return res[0]
}


/**
 * insert what value into something column
 * @param {String} something 
 * @param {Array} what 
 */

export const insertValue = async (something, what) => {
    let q = `INSERT INTO user (${something}) VALUE (?)`
    let res = await connection.query(q, [what], (err) => {
        return err
    })
    return res[0]
}

/**
 * 
 * @param {table name} table 
 * @param {String} something 
 * @param {Array} what 
 * @returns 
 */

export const insert = async (table, something, what) => {
    let q = `INSERT INTO ${table} (${something}) VALUE (?)`
    let res = await connection.query(q, [what], (err) => {
        return err
    })
    return res[0]
}

/**
 * 
 * @param {user_ID} something 
 * @returns 
 */

export const findSession = async (something) => {
    let q = "SELECT * FROM session WHERE user_session_ID = ?"
    let res = await connection.query(q, [something], (err) => {
        return err
    })
    return res[0]
}

export const updateSession = async (content, date, id) => {
    let q = "UPDATE session SET `session_content`=?, `session_date`=? WHERE user_session_ID = ?"
    let res = await connection.query(q, [content, date, id], (err) => {
        return err
    })
    return res
}

/**
 * 
 * @param {*} id 
 * @returns 
 */
export const updateInfoUser = async (avatar, firstName, lastName, email, phoneNumber, gender, dateOFBirth, id) => {
    let q = "UPDATE user SET `avatar`=?, `firstName`=?, `lastName`=?, `email`=?, `phoneNumber`=?,`gender`=?, `dateOFBirth`=? WHERE user_ID = ?"
    let res = await connection.query(q, [avatar, firstName, lastName, email, phoneNumber, gender, dateOFBirth, id], (err) => {
        return err
    })
    return res
}


/**
 * 
 * @param {token} token
 * @returns 
 */

export const deleteSession = async (token) => {
    let q = "DELETE FROM session WHERE session_content = ?"
    let res = await connection.query(q, [token], (err) => {
        return err
    })
    return res
}

// get new user from monday to current day
export const getAddWeekUser = async () => {
    const role_ID = 2
    let q = `SELECT  COUNT(*) AS new_user_this_week FROM user AS u JOIN user_role AS ur ON (ur.user_ID = u.user_ID) 
            WHERE ur.role_ID <> ${role_ID} 
            AND YEARWEEK(u.CreateAt, 3) = YEARWEEK(CURDATE(), 3) AND WEEKDAY(u.CreateAt) <= WEEKDAY(CURDATE())`
    let res = await connection.query(q)
    return res[0][0].new_user_this_week
}

// get new user is created from monday to sunday last week

export const getUserLastWeek = async () => {
    const role_ID = 2
    let q = `SELECT COUNT(*) AS new_user_last_week FROM user AS u JOIN user_role AS ur ON (ur.user_ID = u.user_ID) 
            WHERE ur.role_ID <> ${role_ID}
            AND (WEEK(u.CreateAt, 3) = WEEK(CURDATE(), 3) - 1 AND YEAR(u.CreateAt) = YEAR(CURDATE()))`
    let res = await connection.query(q)
    return res[0][0].new_user_last_week
}

// get number of user according to gender with group of age 

export const getGender = async () => {
    const role_ID = 2
    let q = `SELECT u.gender, 
            CASE 
                WHEN TIMESTAMPDIFF(YEAR, STR_TO_DATE(dateOFBirth, "%Y-%m-%d"), CURDATE()) BETWEEN 13 AND 17 THEN "13-17"
                WHEN TIMESTAMPDIFF(YEAR, STR_TO_DATE(dateOFBirth, "%Y-%m-%d"), CURDATE()) BETWEEN 18 AND 24 THEN "18-24"
                WHEN TIMESTAMPDIFF(YEAR, STR_TO_DATE(dateOFBirth, "%Y-%m-%d"), CURDATE()) BETWEEN 25 AND 34 THEN "25-34"
                WHEN TIMESTAMPDIFF(YEAR, STR_TO_DATE(dateOFBirth, "%Y-%m-%d"), CURDATE()) BETWEEN 35 AND 44 THEN "35-44"
                WHEN TIMESTAMPDIFF(YEAR, STR_TO_DATE(dateOFBirth, "%Y-%m-%d"), CURDATE()) BETWEEN 45 AND 54 THEN "45-54"
                WHEN TIMESTAMPDIFF(YEAR, STR_TO_DATE(dateOFBirth, "%Y-%m-%d"), CURDATE()) BETWEEN 55 AND 64 THEN "55-64"
                ELSE "65+"
            END AS age_group,
            COUNT(*) AS count FROM user AS u JOIN user_role AS ur ON (ur.user_ID = u.user_ID) 
            WHERE ur.role_ID <> ${role_ID}
            GROUP BY gender, age_group`
    let res = await connection.query(q)
    return res[0]
}

// list user for admin manage user
export const listUserManage = async () => {
    const role_ID = 2
    let q = `SELECT u.user_ID, firstName, lastName, TIMESTAMPDIFF(YEAR, STR_TO_DATE(dateOFBirth, "%Y-%m-%d"), CURDATE()) AS age, createAt 
            FROM user AS u
            JOIN user_role AS ur ON (ur.user_ID = u.user_ID)
            WHERE ur.role_ID <> ${role_ID}`
    let res = await connection.query(q)
    return res[0]
}

// check user is block or not
export const checkBlock = async (userID) => {
    const role_ID = 2
    let q = `SELECT u.isBlock FROM user AS u JOIN user_role AS ur ON (ur.user_ID = u.user_ID) 
            WHERE ur.role_ID <> ${role_ID} AND u.user_ID = ?`
    let res = await connection.query(q, [userID])
    return res[0][0]
}

export const changeBlock = async (type, userID) => {
    let q = "UPDATE user SET `isBlock`=? WHERE user_ID = ?"
    let res = await connection.query(q, [type, userID])
    return res[0][0]
}

// suggestion friend from user sec
export const suggestion = async (userID) => {
    let q = `SELECT DISTINCT u.user_ID, u.firstName, u.lastName, u.avatar
            FROM user u
            WHERE u.user_ID IN (
                SELECT f1.user_sec_ID
                FROM friend f1
                WHERE f1.user_first_ID IN (
                    SELECT f2.user_sec_ID
                    FROM friend f2
                    WHERE f2.user_first_ID = ?
                    UNION
                    SELECT f3.user_first_ID
                    FROM friend f3
                    WHERE f3.user_sec_ID = ?
                )
                AND f1.user_sec_ID NOT IN (
                    SELECT f4.user_sec_ID
                    FROM friend f4
                    WHERE f4.user_first_ID = ?
                    UNION
                    SELECT f5.user_first_ID
                    FROM friend f5
                    WHERE f5.user_sec_ID = ?
                )
            )
            AND u.user_ID != ?
            ORDER BY RAND()
            LIMIT 2`
    let res = await connection.query(q, [userID, userID, userID, userID, userID])
    return res[0]
}

//suggestion from user first

export const suggestionTwo = async (userID) => {
    let q = `SELECT DISTINCT u.user_ID, u.firstName, u.lastName, u.avatar
            FROM user u
            WHERE u.user_ID IN (
                SELECT f1.user_first_ID
                FROM friend f1
                WHERE f1.user_sec_ID IN (
                    SELECT f2.user_first_ID
                    FROM friend f2
                    WHERE f2.user_sec_ID = ?
                    UNION
                    SELECT f3.user_sec_ID
                    FROM friend f3
                    WHERE f3.user_first_ID = ?
                )
                AND f1.user_first_ID NOT IN (
                    SELECT f4.user_first_ID
                    FROM friend f4
                    WHERE f4.user_sec_ID = ?
                    UNION
                    SELECT f5.user_sec_ID
                    FROM friend f5
                    WHERE f5.user_first_ID = ?
                )
            )
            AND u.user_ID != ?
            ORDER BY RAND()
            LIMIT 2`
    let res = await connection.query(q, [userID, userID, userID, userID, userID])
    return res[0]
}

