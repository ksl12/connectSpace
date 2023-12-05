import { useEffect, useState } from "react"
import io from "socket.io-client"
import { store } from "./src/state/store"
import { storeAd } from "./src/state/storeAdmin"
import { Box, Modal, Typography } from "@mui/material"
import { logout } from "./src/services/apiServicesAuth"


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    zIndex: 9999
}
  

const SocketClient = () => {
    const [open, setOpen] = useState(false)
    const handleClose = (e, reason) => {
        if (reason === 'backdropClick') {
            setOpen(false)
            setBlock(0)
            setToken({}, "")
            socket.disconnect()
        }
        setOpen(false)
    }
    const handleOpen = () => {
        setOpen(true)
    }

    const socket = io(import.meta.env.VITE_SERVER_URL, {
        reconnection: false
    })
    const adminSocket = io(import.meta.env.VITE_SERVER_ADMIN_URL, {
        reconnection: false
    })
    const user = store((state) => state.user)
    const role = store((state) => state.role)
    const isBlock = store((state) => state.isBlock)
    const setToken = store((state) => state.setToken)
    const setSocket = store((state) => state.setSocket)
    const setBlock = store((state) => state.setBlock)

    const setTotalActiveUser = storeAd((state) => state.setTotalActiveUser)
    const setAdminSocket = storeAd((state) => state.setAdminSocket)

    useEffect(() => {
        let ignore = false
        if(!ignore) {
            if(isBlock == 1) {
                // console.log("1")
                setOpen(true)
            }
        }
        return () => {
            ignore = true
        }
    }, [isBlock])

    
    //socket

    // get activeUser when user or admin login
    useEffect(() => {
        let ignore = false
        if(!ignore) {
            if(user.user_ID && role == 1) {
                setSocket(socket)
                // console.log(user.user_ID, "12")
                socket.emit("newUser", user.user_ID)
            }
            else if(user.user_ID && role == 2) {
                setAdminSocket(adminSocket)
                // console.log(adminSocket)
                adminSocket.emit("newAdmin", user.user_ID)
                adminSocket.emit("getActiveUsers")
            }
        }
        return () => {
            ignore = true
        }
    }, [socket, adminSocket])
    
    // Set Active User when login is admin
    useEffect(() => {
        let ignore = false
        if(!ignore) {
            if(user.user_ID && role == 2) {
                adminSocket.on("getActiveUsersToClient", (totalActive) => {
                    setTotalActiveUser(totalActive)
                })
            }
        }
        return () => {
            ignore = true
            if(!ignore) {
                adminSocket.off("getActiveUsersToClient")
            }
        }
    }, [adminSocket])

    // send block to user
    // or user get signal block
    useEffect(() => {
        let ignore = false
        if(!ignore) {
            socket?.on("blockUser", async ({userID}) => {
                if(userID == user.user_ID) {
                    // console.log("1")
                    handleOpen()
                    await logout()
                    socket.disconnect()
                }
            })        
        }
        return () => {
            ignore = true
            // if(!ignore) {
            //     socket?.off("blockUser")
            // }
        }
    }, [socket])
    
    return (
        <Modal
            // keepMounted
            open={open}
            onClose={handleClose}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
        >
            <Box sx={style}>
            <Typography id="keep-mounted-modal-title-block" variant="h6" component="h2">
                Thông Báo
            </Typography>
            <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                Tài Khoản của bạn đã bị khóa, vui lòng liên hệ để biết thêm chi tiết.
            </Typography>
            </Box>
        </Modal>
    );
}
//end socket

export default SocketClient