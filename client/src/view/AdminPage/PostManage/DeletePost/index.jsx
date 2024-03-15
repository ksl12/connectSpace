import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { store } from "../../../../state/store";
import {deleteImage, deletePost} from "../../../../services/apiServicesPost"
import { useEffect, useState } from "react";
import { storeAd } from "../../../../state/storeAdmin";


const DeletePost = ({userID, postID, setReloadData, reloadData, imageURL}) => {
    const [open, setOpen] = useState(false)
    const token = store((state) => state.token) 
    const adminSocket = storeAd((state) => state.adminSocket)

    const reloadTable = () => {
        setReloadData(!reloadData)
    }

    const DeletePostAdmin = async () => {
        await deletePost(postID, token)
        if(imageURL) {
            await deleteImage(imageURL, token)
        }
        adminSocket.emit("adminDeletePost", (userID))
        handleClose()
        reloadTable()
    }

    const handleClickOpen = () => {
        setOpen(true)
    }


    const handleClose = () => {
        setOpen(false)
    }

    return (
        <>
            <Button sx={{display: "flex", justifyContent: "center"}} onClick={handleClickOpen}>
                <DeleteIcon /> 
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="deletePostDialog">
                    {"Xóa bài đăng"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description-delete-post">
                        Sau khi bấm sẽ xóa bài đăng này. Bạn chắc chắn chứ ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={DeletePostAdmin}>Xóa</Button>
                    <Button onClick={handleClose} autoFocus>
                        Hủy
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default DeletePost