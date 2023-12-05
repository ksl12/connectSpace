import { Avatar, Box, Card, CardActions, CardContent, CardHeader, CardMedia, Divider, IconButton, Stack, Typography, useMediaQuery} from "@mui/material"
import ShareIcon from '@mui/icons-material/Share'
import dayjs from "dayjs"
import "dayjs/locale/vi"
import utc from "dayjs/plugin/utc"
import relativeTime from "dayjs/plugin/relativeTime"
import timezone from 'dayjs/plugin/timezone';
import NavBar from "../NavBar/NavBar";
import ClickSettingPost from "../ClickSettingPost";
import Like from "../Like";
import Comment from "../Comment";
import CommentList from "../CommentList";
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { getOnlyOnePost } from "../../services/apiServicesPost"
import { store } from "../../state/store"


dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale("vi")

const PostDetail = () => {
    const [post, setPost] = useState([])
    const [reload, setReload] = useState(false)
    const token = store((state) => state.token) 
    const {postID} = useParams()
    const navigate = useNavigate()
    const now = dayjs.utc()
    const isMedium = useMediaQuery("(min-width: 775px)")
    useEffect(() => {
        let ignore = false
        const fetchOnlyOneP = async () => {
            let res = await getOnlyOnePost(postID, token)
            if(!ignore) {
                res = res.map(item => {
                    return {
                        ...item,
                        state: false
                    }
                })
                setPost(res)
            }
        }
        fetchOnlyOneP()
        return () => {
            ignore = true
        }
    }, [reload, postID])
    const reloadData = () => {
        setReload(!reload);
    };
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
        <Stack position="relative" height="100%" >
            <NavBar />
            <Box
                width="100%"
                padding="1rem 5%"
                gap="1rem"
                position="relative"
                top="70px"
                display="flex"
                justifyContent="center"
            >
                {post.length > 0  && post.map((p) => 
                    (
                        <Card sx={{ maxWidth: "100%", my: 2}} key={p.post_ID}>
                            <CardHeader
                                avatar={
                                    <Avatar 
                                        src={"/upload/" + p.avatar}  
                                        aria-label="recipe" 
                                        sx={{"&:hover": {cursor: "pointer"}}} 
                                        onClick={() => {navigate("/profile/" + p.user_ID, { replace: true })}}
                                    />
                                }
                                action={
                                    <ClickSettingPost userID={p.user_ID} postID={p.post_ID} imageURL={p.image_URL} isDetail={1}/>
                                }
                                title= {p?.firstName + " " + p?.lastName}
                                titleTypographyProps={{fontSize: "18px"}}
                                subheader= {now.diff(dayjs.utc(p.createAT), "week") >= 1 ? dayjs.utc(p.createAT).tz('Asia/Bangkok').format("DD/MM/YYYY [lúc] HH:mm") : 
                                dayjs.utc(p.createAT).from(now)}
                                subheaderTypographyProps={{
                                    onClick: (() => {
                                            navigate("/post/" + p.post_ID, { replace: true })
                                        }
                                    ),
                                    sx: {
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
                                    {p.content}
                                </Typography>
                            </CardContent>
                            {p.image_URL && (
                                    <CardMedia
                                        component="img"
                                        height="250px"
                                        sx={{objectFit: "contain"}}
                                        image={"/upload/" + p.image_URL}
                                        alt="Ảnh bài đăng"
                                    />
                                )
                            }
                            <Divider sx={{ margin: "0.5rem 0" }}/>
                            <CardActions disableSpacing sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                <Box display="flex">
                                    <Like post={p.post_ID} />
                                    <Comment post={p.post_ID} key={p.post_ID} onPostClick={handlePostClick} reload={reload}/>
                                </Box>
                                <IconButton aria-label="share">
                                    <ShareIcon />
                                </IconButton>
                            </CardActions>
                            <Divider sx={{ margin: "0.5rem 0" }}/>
                            {
                                (p.state === true) && 
                                (   
                                    <CommentList post={p.post_ID} reloadData={reloadData}/>
                                )
                            }
                        </Card>
                    )
                )}
            </Box>
        </Stack>
    );
}

export default PostDetail