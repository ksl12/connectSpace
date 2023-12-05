import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack} from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { store } from "../../../state/store";
import { storeAd } from "../../../state/storeAdmin";
import { useEffect, useState } from "react";
import { Block, checkBlock, openBlocked } from "../../../services/apiServiceAdmin";

const BlockUser = ({userID}) => {
    const [reload, setReload] = useState(false)
    const [open, setOpen] = useState(false)
    const [openUnBlock, setOpenUnBlock] = useState(false)
    const [check, setCheck] = useState(0)
    const token = store((state) => state.token) 
    const adminSocket = storeAd((state) => state.adminSocket)

    // run to check user is block or not
    useEffect(() => {
        let ignore = false
        const checkBlockUser = async () => {
            let checkUserBlock = await checkBlock(userID, token)
            if(!ignore) {   
                setCheck(checkUserBlock.isBlock)
            }
        }
        checkBlockUser()
        return () => {
            ignore = true
        }
    }, [reload])

    

    const reloadTable = () => {
        setReload(!reload)
    }

    // send block to user
    const BlockUser = async () => {
        const formData = new FormData()
        formData.append("userID", userID)
        await Block(formData, token)
        adminSocket.emit("adminBlockUser", (userID))
        handleClose()
        reloadTable()
    }

    const UnBlockUser = async () => {
        const formData = new FormData()
        formData.append("userID", userID)
        await openBlocked(formData, token)
        handleCloseUnBlock()
        reloadTable()
    }

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClickOpenUnBlock = () => {
        setOpenUnBlock(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleCloseUnBlock = () => {
        setOpenUnBlock(false)
    }
    return (
        <>
            {
                check == 0 ?
                <>
                    <Button sx={{display: "flex", justifyContent: "center"}} onClick={handleClickOpen}>
                        <LockOpenIcon /> 
                    </Button>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="blockUserDialog">
                            {"Chặn"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description-block-user">
                                Sau khi bấm sẽ chặn người dùng này. Bạn chắc chắn chứ ?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={BlockUser}>Chặn</Button>
                            <Button onClick={handleClose} autoFocus>
                                Hủy
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
                :
                <>
                    <Button sx={{display: "flex", justifyContent: "center"}} onClick={handleClickOpenUnBlock}>
                        <LockIcon sx={{color: "red"}} /> 
                    </Button>
                    <Dialog
                        open={openUnBlock}
                        onClose={handleCloseUnBlock}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="unBlockUserDialog">
                            {"Mở Chặn"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description-unBlock-user">
                                Sau khi bấm sẽ mở chặn người. Bạn chắc chắn chứ ?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={UnBlockUser}>Mở Chặn</Button>
                            <Button onClick={handleCloseUnBlock} autoFocus>
                                Hủy
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            } 
        </>
    );
}

export default BlockUser