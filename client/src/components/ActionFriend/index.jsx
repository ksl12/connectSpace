import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Typography} from "@mui/material"
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useEffect, useState } from "react";
import { store } from "../../state/store";
import { useParams } from "react-router-dom";
import { checkFriend, checkReceiveRequest, checkSendRequest } from "../../services/apiServiceFriend";
import UpdateUser from "../UpdateUser/index.jsx";


const ActionFriend = ({token, handleReload}) => {
    const [open, setOpen] = useState(false)
    const [openRemove, setOpenRemove] = useState(false)
    const [openAdd, setOpenAdd] = useState(false)
    const [check, setCheck] = useState(null)
    const [checkSend, setCheckSend] = useState(null)
    const [checkReceive, setCheckReceive] = useState(null)
    const user = store((state) => state.user)
    const socket = store((state) => state.socket)
    let { userID } = useParams()
    // console.log(socket)
    // check has friend or not 
    useEffect(() => {
        let ignore = false
        const checkISFriend = async () => {
            let check = await checkFriend(user.user_ID, userID, token)
            if(!ignore) {
                setCheck(check)
            }
        }
        socket?.on("checkFriend", async (data) => {
            let check = await checkFriend(data.sendID, data.friendID, token)
            if(!ignore) {
                setCheck(check)
            }
        })
        checkISFriend()
        return () => {
            socket?.off("checkFriend")
            ignore = true
        }
    }, [userID, socket])

    // check user has send to this user
    useEffect(() => {
        let ignore = false
        const checkISSend = async () => {
            let arraySend = await checkSendRequest(user.user_ID, token)
            let checkSendReq = 0
            for (let element of arraySend) {
                if(element.receive_user_ID == userID) {
                    checkSendReq = 1
                    break
                }
            }
            if(!ignore) {
                setCheckSend(checkSendReq)
            }
        }
        // change send type real time of send user
        socket?.on("checkSend", async (data) => {
            let arraySend = await checkSendRequest(data.sendID, token)
            let checkSendReq = 0
            for (let element of arraySend) {
                if(element.receive_user_ID == userID) {
                    checkSendReq = 1
                    break
                }
            }
            if(!ignore) {
                setCheckSend(checkSendReq)
            }
        })
        checkISSend()
        return () => {
            socket?.off("checkSend")
            ignore = true
        }
    }, [userID, socket])

    // check receive
    useEffect(() => {
        let ignore = false
        // change receive type real time of receive user
        const checkISReceive = async () => {
            let arrayReceive = await checkReceiveRequest(user.user_ID, token)
            let checkReceiveReq = 0
            for (let element of arrayReceive) {
                if(element.send_user_ID == userID) {
                    checkReceiveReq = 1
                    break;
                }
            }
            if(!ignore) {
                setCheckReceive(checkReceiveReq)
            }
        }
        socket?.on("checkReceive", async (data) => {
            let arrayReceive = await checkReceiveRequest(data.friendID, token)
            let checkReceiveReq = 0
            for (let element of arrayReceive) {
                if(element.send_user_ID == userID) {
                    checkReceiveReq = 1
                    break;
                }
            }
            if(!ignore) {
                setCheckReceive(checkReceiveReq)
            }
        })
        checkISReceive()
        return () => {
            socket?.off("checkReceive")
            ignore = true
        }
    }, [userID, socket])

    const handleSendRequest = () => {
        socket.emit("sendRequest", {
            sendID: user.user_ID,
            friendID: userID,
            sendFirstName: user.firstName,
            sendLastName: user.lastName
        })
    }

    const handleDeleteRequest = () => {
        socket.emit("deleteRequest", {
            sendID: user.user_ID,
            friendID: userID
        })
    }

    const handleDeleteFriend = () => {
        handleClose()
        socket.emit("deleteFriend", {
            sendID: user.user_ID,
            friendID: userID
        })
    }

    const handleRemoveReq = () => {
        handleCloseRemove()
        socket.emit("rejectRequest", {
            sendID: userID,
            friendID: user.user_ID
        })
    }

    const handleAddFriend = () => {
        handleCloseAdd()
        socket.emit("acceptFriend", {
            sendID: userID,
            friendID: user.user_ID,
            sendFirstName: user.firstName,
            sendLastName: user.lastName 
        })
    }
    const handleClickOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false)
    };
    
    const handleClickOpenRemove = () => {
        setOpenRemove(true)
    };

    const handleCloseRemove = () => {
        setOpenRemove(false)
    };

    const handleClickOpenAdd = () => {
        setOpenAdd(true)
    };

    const handleCloseAdd = () => {
        setOpenAdd(false)
    };
    return (
        <>  
            {userID == user.user_ID ?
                <UpdateUser handleReload={handleReload}/>
                :
                check === 1 ? 
                    <>
                        <IconButton onClick={handleClickOpen}>
                            <PersonRemoveIcon />
                        </IconButton>
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="deleteFriendDialog">
                                {"Xóa Bạn"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Sau khi xóa sẽ không thể hoàn tác. Bạn chắc chắn chứ ?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleDeleteFriend}>Xóa</Button>
                                <Button onClick={handleClose} autoFocus>
                                    Hủy
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </>
                :
                checkSend === 1 ?
                    <IconButton sx={{display: "flex", gap: "5px"}} onClick={handleDeleteRequest}>
                        <Typography>Hủy</Typography>
                    </IconButton>
                :
                checkReceive === 1 ?
                    <Box>
                        <IconButton onClick={handleClickOpenRemove}>
                            <RemoveIcon />
                        </IconButton>
                        <Dialog
                            open={openRemove}
                            onClose={handleCloseRemove}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="removeReqDialog">
                                {"Từ Chối Yêu Cầu"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-reject">
                                    Sau khi Từ Chối sẽ không thể hoàn tác. Bạn chắc chắn chứ ?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleRemoveReq}>Từ Chối</Button>
                                <Button onClick={handleCloseRemove} autoFocus>
                                    Hủy
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <IconButton onClick={handleClickOpenAdd}>
                            <AddIcon />
                        </IconButton>
                        <Dialog
                            open={openAdd}
                            onClose={handleCloseAdd}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="addFriendDialog">
                                {"Chấp nhận Yêu Cầu"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-addFriend">
                                    Bấm thêm bạn để thêm bạn mới
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleAddFriend}>Thêm Bạn</Button>
                                <Button onClick={handleCloseAdd} autoFocus>
                                    Hủy
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                :
                <IconButton onClick={handleSendRequest}>
                    <PersonAddIcon />
                </IconButton>
            }
        </>
    ) 
}

export default ActionFriend