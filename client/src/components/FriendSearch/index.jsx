import { Avatar, Box, Card, CardHeader, useMediaQuery } from "@mui/material";

import { useEffect, useRef, useState } from "react";
import { loadFriend } from "../../services/apiServiceFriend";
import ClickSettingFriend from "../ClickSettingFriend";

const FriendSearch = ({userID, token, reloadData}) => {
    const [friendList, setFriendList] = useState([])
    const [page, setPage] = useState(0)
    const [loading, setLoading] = useState(false)
    const hasMore = useRef(true);
    // const [reloadFriend, setReloadFriend] = useState(false)
    const isTablet = useMediaQuery("(min-width: 560px)")
    const isMobile = useMediaQuery("(min-width: 470px)")

  
    useEffect(() => {
        let ignore = false
        const fetchFriend = async () => {
            const res = await loadFriend(userID, page, token)
            if(!ignore) {
                setFriendList((prevFriend) => {
                    return [...prevFriend, ...res]
                }) 
                if( res.length < 12) {
                    hasMore.current = false
                }
                setLoading(false)
            }
        }
        fetchFriend()
        return () => {
            ignore = true
        }
    }, [page])

    useEffect(() => {
        const handleScroll = () => {
            if (!loading && hasMore.current && window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
                // console.log("2")
                setLoading(true)
                setPage((prev) => prev + 1);
            }
        }
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
 


    const handleReloadFriend = () => {
        setPage(prevPage => prevPage = 0)
        setFriendList([])
    }


    return (
        <Box display="flex" mb="1rem" justifyContent="center" alignItems="center" sx={{transform: "translateY(6%)"}}>
            <Box display="flex" gap="0.5rem" flexWrap="wrap" width="100%" 
                sx={{
                    "& > *" : isMobile ? {flexBasis: "calc((100% / 3) - 0.34rem)", width: "100%"}
                    : {flexBasis: "100%", width: "100%"}
                }}
            >   
                {loading ? 
                    <div>loading</div>
                    : 
                    friendList.map((friend, index) => (
                        <Card key={friend.user_ID}>
                            <CardHeader
                                avatar={
                                    <Avatar alt="" src={"/upload/" + friend.avatar} style={{borderRadius: "8px"}}  sx={{ width: isTablet ? "80px" : "50px", height: isTablet ? "80px" : "50px"}}/>
                                }
                                action={
                                    <ClickSettingFriend userID={userID} token={token} friendID={friend.user_ID} reloadData={reloadData} reloadFriend = {handleReloadFriend}/>
                                }
                                title= {friend.firstName + " " + friend.lastName}
                                sx={{"& .css-sgoict-MuiCardHeader-action": {alignSelf: "center", ml: "1rem"}}}
                            />
                        </Card>
                    ))
                }
            </Box>
        </Box>
    );
}

export default FriendSearch