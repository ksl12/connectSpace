import { Box, Divider, Stack, Typography, useColorScheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { getNumberFriend } from "../../services/apiServiceFriend";
import { store } from "../../state/store";
import FriendSearch from "../FriendSearch"

const FriendList = () => {
    const [numberFriend, setNumberFriend] = useState([])
    const [reload, setReload] = useState(false)
    const { mode} = useColorScheme();
    const user = store((state) => state.user)
    const token = store((state) => state.token) 
    useEffect(() => {
        (async () => {
            try {
                let number = await getNumberFriend(user.user_ID, token)
                setNumberFriend(number[0].numberFriend)
            } catch (error) {
                console.log(error)
            }
        })()
    }, [reload])
    const reloadData = () => {
        setReload(!reload);
    };
    return (
        <Box 
            sx={{backgroundColor: (mode === "light" ? "white" : "rgb(169,169,169)"), height: "calc(100% - 80px)"}}
            width="100%"
            margin="1rem auto"
            gap="1rem"
            position="relative"
            top="70px"
            borderRadius= "1rem"
        >   
            <Stack border= "1px">
                <Typography fontSize="1.3rem" marginLeft="1rem">Bạn Bè</Typography>
                <Divider sx={{ margin: "1rem 0" }}/>
                <Box display="flex" gap="1rem" my="0.5rem" ml="1rem">
                    <Typography fontWeight="bold" lineHeight="1rem" sx={{cursor: "pointer"}}>Tất cả bạn bè</Typography>
                </Box>
                <Divider sx={{ margin: "1rem 0" }}/>
                <Box display="flex" gap="1rem" my="0.5rem" ml="1rem">
                    <Typography fontWeight="bold" lineHeight="1rem" sx={{cursor: "pointer"}}>Bạn ({numberFriend})</Typography>
                </Box>
                <Divider sx={{ margin: "1rem 0" }}/>
                <FriendSearch userID={user.user_ID} token={token} reloadData={reloadData}/>
            </Stack>
        </Box>
    );
}

export default FriendList