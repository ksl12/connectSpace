import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import "dotenv/config"

import {findOne, findSession, getID, insertValue, insert, findRoleUser, updateSession, deleteSession} from "../models/userModel.js"

const register = async (req, res) => {
    try {
        const { username, password, firstName, lastName, email, phoneNumber, gender, dateOFBirth} = req.body
        let user_name = await findOne("username",username)
        let user_email = await findOne("email", email)
        let user_phoneNumber = await findOne("phoneNumber", phoneNumber)
        if(user_name.length > 0) {
            return res.status(400).json({messages: "Tài khoản đã được sử dụng"})
        }
        if(user_email.length > 0) {
            return res.status(400).json({messages: "Email đã được sử dụng"})
        }
        if(user_phoneNumber.length > 0) {
            return res.status(400).json({messages: "Số điện thoại đã được sử dụng"})
        }
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)
        const date = new Date(dateOFBirth)

        const columnName = "username, password, firstName, lastName, email, phoneNumber, gender, dateOFBirth"
        const values = [username, passwordHash, firstName, lastName, email, phoneNumber, gender, date]
        // insert new user
        await insertValue(columnName ,values)

        const user_ID = await getID(username)

        await insert("user_role", "user_ID, role_ID", [user_ID[0].user_ID, 1])

        res.status(200).json({messages: "Register successful"})
    } 
    catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })    
    }
}

const login = async (req, res) => {
    try {
        const { username, password} = req.body
        let user = await findOne("username", username)
        if(user.length == 0) {
            return res.status(400).json({messages: "Tài Khoản không tồn tại"})
        }
        
        const check = bcrypt.compare(password, user[0].password)
        if(!check) return res.status(400).json({messages: "Tài khoản hoặc mật khẩu không đúng"})
        
        const role = await findRoleUser(user[0].user_ID)

        const access_token = createAccessToken({id: user[0].user_ID})
        const refresh_token = createRefreshToken({id: user[0].user_ID})

        const {password: pass , ...others} = user[0]

        const values = [refresh_token, new Date(new Date().getTime() + (30 * 24 * 60 * 60 * 1000)), user[0].user_ID]
        await insert("session", "session_content, session_date, user_session_ID", values)
        res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            path: "/",
            sameSite: "Lax",
            secure: true,
            maxAge: 30 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({
            messages: "Login successful",
            access_token: access_token,
            user: {
                ...others,
                role
            }
        })
    } 
    catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })
        
    }
}


const refreshAccessToken = async (req, res) => {
    try {
        const rf_token = req.cookies.refresh_token

        if(!rf_token) {
            return res.status(401).json({messages: "Please login again"})
        }
        jwt.verify(
            rf_token,
            process.env.REFRESH_KEY,
            async (err, result) => {
                if (err) {
                    res.status(401).json({ msg: "Please login again." })
                }
        
                if (!result) {
                    res.status(400).json({ msg: "User does not exist." })
                }
                const user = await findOne("user_ID", result.id)

                let session = await findSession(result.id)
                if(session.length > 0) {
                    const role = await findRoleUser(user[0].user_ID)
                    const {password: pass , ...others} = user[0]
                    
                    const access_token = createAccessToken({ id: result.id })
                    const refresh_token = createRefreshToken({ id: result.id })
                    await updateSession(refresh_token, new Date(new Date().getTime() + (30 * 24 * 60 * 60 * 1000)), result.id)
                    res.cookie("refresh_token", refresh_token, {
                        httpOnly: true,
                        path: "/",
                        sameSite: "Lax",
                        secure: true,
                        maxAge: 30 * 24 * 60 * 60 * 1000
                    })
                    res.status(200).json({ 
                        access_token: access_token,
                        user: {
                            ...others,
                            role: role
                        }
                    });
                }
            }
        )
    } 
    catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })
    }
}

const logout = async (req, res) => {
    try {
        const rf_token = req.cookies.refresh_token
        await deleteSession(rf_token) 
        res.clearCookie("refresh_token", {path: "/", secure: true, sameSite: "Lax"})
        return res.status(200).json({messages: "User has been logged out"})
    } catch (error) {
        res.status(500).json({
            errors: new Error(error).message
        })
    }
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_KEY, {
        expiresIn: "1d"
    })
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_KEY, {
        expiresIn: "30d"
    })
}

export const authCtrl = {
    register,
    login,
    refreshAccessToken,
    logout
}