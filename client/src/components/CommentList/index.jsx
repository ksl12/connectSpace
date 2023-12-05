import { Avatar, Box, Button, Stack, TextField} from "@mui/material"
import SendIcon from '@mui/icons-material/Send';
import { useEffect, useRef, useState } from "react"
import { addNewComment, loadComment } from "../../services/apiServiceComment"
import { store } from "../../state/store";
import RenderComment from "../RenderComment";

const CommentList = ({post, reloadData}) => {
    const [postedComment, setPostedComment] = useState([])
    const [desc, setDesc] = useState("")
    const replyRef = useRef()
    const token = store((state) => state.token) 
    const user = store((state) => state.user) 
    useEffect(() => {
        (async () => {
            try {
                let oldComment = await loadComment(post, token)
                setPostedComment(oldComment)
            } catch (error) {
                console.log(error)
            }
        })()
    }, [])

    const handleDesc = (e) => {
        setDesc(e.target.value)
    }
    const handleAddReply = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("userID", user.user_ID)
        formData.append("postID", post)
        formData.append("desc", desc)
        formData.append("parentID", -1)
        await addNewComment(formData, token)
        setDesc("")
        replyRef.current.value = ""
        reloadData()
    }
    return (
        <Stack>
            <Box sx={{fontSize: "15px", display: "flex", alignItems: "center", m: "15px", gap: "10px"}} >
                <Avatar src={"/upload/" + user.avatar} sx={{height: "42px", width: "42px"}}/>
                <TextField 
                    autoComplete="off"
                    placeholder="Viết bình luận của bạn"
                    maxRows={2}
                    name="Comment"
                    variant="outlined"
                    size="small"
                    fullWidth
                    inputRef={replyRef}
                    defaultValue={desc}
                    onBlur={handleDesc}
                />
                <Button variant="contained" endIcon={<SendIcon />} size="medium" onClick={handleAddReply}>
                    Gửi
                </Button>
            </Box>
            {postedComment.length > 0 &&
                (
                    <RenderComment comments={postedComment} post={post} reloadData={reloadData}/>
                )
            }
        </Stack>
        
    ) 
}

export default CommentList