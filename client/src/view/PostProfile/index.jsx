import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Divider, IconButton, Stack, TextField, Typography, useColorScheme, useMediaQuery } from "@mui/material";
import ImageIcon from '@mui/icons-material/Image'
import MoodIcon from '@mui/icons-material/Mood'
import SendIcon from '@mui/icons-material/Send'
import ClearIcon from '@mui/icons-material/Clear'
import ShareIcon from '@mui/icons-material/Share'
import dayjs from "dayjs"
import "dayjs/locale/vi"
import utc from "dayjs/plugin/utc"
import relativeTime from "dayjs/plugin/relativeTime"
import timezone from 'dayjs/plugin/timezone';
import { useTheme } from "@emotion/react"
import { useEffect, useRef, useState } from "react"

import { addImage, addNewPost, getPostUser } from "../../services/apiServicesPost";
import Like from "../../components/Like"
import Comment from "../../components/Comment"
import CommentList from "../../components/CommentList"
import ClickSettingPost from "../../components/ClickSettingPost"    
import { useNavigate, useParams } from "react-router-dom";
import { store } from "../../state/store";

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale("vi")

const PostProfile = ({token, thisUserID, avatar}) => {
    const [image, setImage] = useState(null)
    const [desc, setDesc] = useState("")
    const [post, setPost] = useState([])
    const [reload, setReload] = useState(false)
    const inputRef = useRef()
    const postRef = useRef()
    const theme = useTheme()
    const { mode } = useColorScheme()
    const {userID} = useParams()
    const socket = store((state) => state.socket)
    const navigate = useNavigate()
    const now = dayjs.utc()
    const isMobile = useMediaQuery("(min-width: 400px)")
    const isMedium = useMediaQuery("(min-width: 775px)")
    useEffect(() => {
        (async () => {
            try {
                let Post = await getPostUser(userID, token)
                Post = Post.map(item => {
                    return {
                        ...item,
                        state: false
                    }
                })
                setPost(Post)
            } catch (error) {
                console.log(error)
            }
        })()
    }, [reload, userID])

    // get signal delete post
    useEffect(() => {
        let ignore = false
        if(!ignore) {
            socket?.on("deletePost", async (data) => {
                if(thisUserID == data.userID) {
                    reloadData()
                }
            })
        }
        return () => {
            ignore = true
            if(!ignore) {
                socket?.off("deletePost")
            }
        }
    }, [socket])

    const handleDesc = (e) => {
        setDesc(e.target.value)
    }

    const handleClick = () => {
        inputRef.current.click();
    }
    const reloadData = () => {
        setReload(!reload);
    };

    const handleUploadImage = async () => {
        try {
            const formData = new FormData()
            formData.append("file", image);
            const res = await addImage(formData, token)
            return res
        } catch (error) {
            console.log(error)
        }
    }
    const handleDeleteImage = () => {
        inputRef.current.value = ""
        setImage(null)
    }
    const handleUpload = async (e) => {
        try {
            e.preventDefault()
            let imgUrl = ""
            if(image == null && desc.trim() === "") {
                alert("Không được post bài rỗng")
            }
            else {
                if(image !== null) {
                    imgUrl = await handleUploadImage();
                } 
                const formData = new FormData()
                formData.append("userID", userID)
                formData.append("desc", desc)
                formData.append("image", imgUrl)
                await addNewPost(formData, token)
                setDesc("")
                postRef.current.value = ""
                setImage(null)
                reloadData()
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handlePostClick = (postId) => {
        let temp = [...post]
        for (let i = 0; i < temp.length; i++) {
            if (temp[i].post_ID === postId) {
                temp[i].state ? temp[i].state = false :  temp[i].state = true;
                break;
            }
        }
        setPost(temp)
    }
    return (
        <Box flex={3} flexBasis="70%">
            {thisUserID == userID &&
                <Stack 
                    sx={{backgroundColor: (mode === "light" ? "white" : "rgb(169,169,169)")}}
                    borderRadius= "1rem"
                    px="10px"
                >   
                    <Box 
                        display="flex" 
                        alignItems="center" 
                        borderRadius= "1rem"
                        px="10px"
                    >
                        <Avatar src={"/upload/" + avatar}/>
                        <TextField 
                            autoComplete="off"
                            id="profile-post-id"
                            placeholder="Hôm nay bạn thế nào?"
                            multiline
                            sx={{
                                width: "100%",
                                borderRadius: "2rem",
                                padding: "1rem 2rem",
                            }}
                            fullWidth
                            inputRef={postRef}
                            defaultValue={desc}
                            onBlur={handleDesc}
                        />
                    </Box>  
                    {image && (
                        <Box>
                            <img src={URL.createObjectURL(image)} alt="" style={{objectFit: "cover", height: "100px", width: "100px"}}/>
                            <IconButton onClick={handleDeleteImage} sx={{position: "absolute", cursor: "pointer"}} >
                                <ClearIcon/>
                            </IconButton>
                        </Box>
                    )}
                    <Divider sx={{ margin: "1rem 0" }}/>
                    <Box display="flex" justifyContent="space-between" gap={1} alignItems="center" paddingBottom="10px">
                        <Box display="flex" gap={2}>
                            <Box display="flex" gap={0.5} sx={{cursor: "pointer"}}>
                                <Button variant="raise" sx={{color: "green"}} startIcon={<ImageIcon />} onClick={handleClick}>
                                    {isMobile && "Thêm Ảnh"}
                                <input    
                                    style={{display: "none"}}
                                    type="file"
                                    hidden
                                    onChange={(e) => setImage(e.target.files[0])}
                                    ref={inputRef}
                                    value=""
                                />
                                </Button>
                            </Box>
                            <Box display="flex" gap={0.5} sx={{cursor: "pointer"}}>
                                <Button variant="raise" sx={{color: "green"}} startIcon={<MoodIcon />}>{isMobile && "Thêm Icon"}</Button>
                            </Box>
                        </Box>
                        <Box>
                            <Button variant="contained" endIcon={<SendIcon />} 
                                sx={{"&:hover": {
                                    backgroundColor: (mode === "light") ? theme.colorSchemes.dark.palette.background.alt : theme.colorSchemes.light.palette.background.alt,
                                    color: (mode === "light") ? "whitesmoke" : "black"
                                }}} 
                                onClick={handleUpload}
                            >
                                Gửi
                            </Button>
                        </Box>
                    </Box>
                </Stack>    
            }

            <Stack
                sx={{backgroundColor: (mode === "light" ? "white" : "rgb(169,169,169)")}}
                borderRadius= "1rem"
                px="10px"
                mt={thisUserID != userID ? "0px" : 3}
            >
                { post.length === 0 ?
                    <Typography variant="h2" textAlign="center">Bạn chưa có bài đăng nào</Typography>
                    : post.map((item, index) => (
                        <Card sx={{ maxWidth: "100%", my: 2}} key={item.post_ID}>
                            <CardHeader
                                avatar={
                                    <Avatar 
                                        src={"/upload/" + item.avatar} 
                                        aria-label="recipe" 
                                        sx={{"&:hover": {cursor: "pointer"}}} 
                                        onClick={() => {navigate("/profile/" + item.user_ID, { replace: true })}}
                                    />
                                }
                                action={
                                    <ClickSettingPost userID={item.user_ID} postID={item.post_ID} reloadData={reloadData} imageURL={item.image_URL}/>
                                }
                                title={item.firstName + " " + item.lastName}
                                titleTypographyProps={{fontSize: "18px"}}
                                subheader= {now.diff(dayjs.utc(item.createAT), "week") >= 1 ? dayjs.utc(item.createAT).tz('Asia/Bangkok').format("DD/MM/YYYY [lúc] HH:mm") : 
                                dayjs.utc(item.createAT).from(now)}
                                subheaderTypographyProps={{
                                    onClick: (() => {
                                            navigate("/post/" + item.post_ID, { replace: true })
                                        }
                                    ),
                                    component: "span",
                                    sx: {
                                        display: "inline-block",
                                        "&:hover": {
                                            textDecoration: "underline",
                                            cursor: "pointer"
                                        }
                                    }
                                }}
                            />
                            <CardContent style={{wordWrap: "break-word"}} sx={{width: isMedium ? "60vw" : "85vw"}}>
                                <Typography 
                                    variant="body" 
                                    fontSize={16} 
                                    color="text.primary"
                                    component="p"
                                    style={{whiteSpace: "pre-line"}}
                                >
                                    {item.content}
                                </Typography>
                            </CardContent>
                            {item.image_URL && (
                                    <CardMedia
                                        component="img"
                                        height="250px"
                                        sx={{objectFit: "contain"}}
                                        image={"/upload/" + item.image_URL}
                                        alt="Ảnh bài đăng"
                                    />
                                )
                            }
                            <Divider sx={{ margin: "0.5rem 0" }}/>
                            <CardActions disableSpacing sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                <Box display="flex">
                                    <Like post={item.post_ID} />
                                    <Comment post={item.post_ID} key={item.post_ID} onPostClick={handlePostClick} reload={reload}/>
                                </Box>
                                <IconButton aria-label="share">
                                    <ShareIcon />
                                </IconButton>
                            </CardActions>
                            <Divider sx={{ margin: "0.5rem 0" }}/>
                            {
                                (item.state === true) && 
                                (   
                                    <CommentList post={item.post_ID} reloadData={reloadData}/>
                                )
                            }
                        </Card>
                    ))
                }
            </Stack>
        </Box>
    );
}

export default PostProfile