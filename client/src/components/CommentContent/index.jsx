import { Avatar, Box, Button, Collapse, IconButton, Stack, TextField, Typography } from "@mui/material"
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SendIcon from '@mui/icons-material/Send';
import dayjs from "dayjs"
import "dayjs/locale/vi"
import utc from "dayjs/plugin/utc"
import relativeTime from "dayjs/plugin/relativeTime"
import { useEffect, useRef, useState } from "react"
import { store } from "../../state/store";
import { addNewComment, loadComment } from "../../services/apiServiceComment";

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.locale("vi")


const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));


const CommentContent = ({comment, children, disableReply, post, reloadData}) => {
    const [reply, setReply] = useState(false)
    const [desc, setDesc] = useState("")
    const [expanded, setExpanded] = useState(false);
    const replyRef = useRef()
    const token = store((state) => state.token) 
    const user = store((state) => state.user) 
    const now = dayjs.utc()
    const handleExpandClick = () => {
        setExpanded(!expanded);
    }
    const handleClickReply = () => {
        setReply(!reply)
        if((expanded === false && reply === true) || (expanded === false && reply === false) || (expanded === true && reply === true)  ) {
            setExpanded(!expanded);
        }
    }
    const handleDesc = (e) => {
        setDesc(e.target.value)
    }
    const handleAddReply = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("userID", user.user_ID)
        formData.append("postID", post)
        formData.append("desc", desc)
        formData.append("parentID", comment.comment_ID)
        await addNewComment(formData, token)
        setDesc("")
        replyRef.current.value = ""
        reloadData()
    }
    return (
        <Stack my="0.5rem">
            <Box sx={{fontSize: "15px", display: "flex", alignItems: "start", gap: "10px"}} >
                <Avatar src={"/upload/" + comment.avatar} sx={{height: "42px", width: "42px"}}/>
                <Box sx={{display: "flex", gap: "10px"}}>
                    <Box>
                        <Typography>{comment.firstName + " " + comment.lastName}</Typography>
                        <Typography>{comment.comment_content}</Typography>
                        {disableReply ? 
                            <Typography flex="1" fontSize="11px" fontWeight="0" sx={{cursor: "not-allowed"}} display="inline-block">Trả lời</Typography> 
                            :
                            <Typography 
                                fontSize="11px" fontWeight="bold" width="100%" display="inline-block"
                                sx={{cursor: "pointer",width: "auto" ,"&:hover": {textDecoration: "underline"}}} 
                                onClick={handleClickReply}
                            >Trả lời</Typography>
                        }
                        {disableReply ? 
                            null
                            :
                            <ExpandMore
                                expand={expanded}
                                onClick={handleExpandClick}
                                aria-expanded={expanded}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon />
                            </ExpandMore>
                        }
                    </Box>
                    <Typography fontSize="0.7rem" fontWeight="100">{dayjs.utc(comment.createAT).from(now)}</Typography>
                </Box>
            </Box>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                {reply && 
                    <Box display="flex" gap="10px" ml="1rem" alignItems="center">
                        <Avatar src={"/upload/" + user.avatar} sx={{height: "42px", width: "42px"}}/>
                        <TextField 
                            autoComplete="off"
                            maxRows={2}
                            size="small"
                            sx={{
                                borderRadius: "2rem",
                            }}
                            inputRef={replyRef}
                            defaultValue={desc}
                            onBlur={handleDesc}
                            fullWidth
                        />
                        <SendIcon sx={{color: "blue", cursor: "pointer"}} onClick={handleAddReply}/>
                    </Box>
                }
                {expanded && children}
            </Collapse>
        </Stack>
    ) 
}

export default CommentContent