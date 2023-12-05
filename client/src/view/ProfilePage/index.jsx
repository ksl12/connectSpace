import { Box, useMediaQuery } from "@mui/material";
import NavBar from "../../components/NavBar/NavBar";
import PostProfile from "../PostProfile";
import InfoUser from "../../components/InfoUser";
import { store } from "../../state/store";

const ProfilePage = () => {
    const user = store((state) => state.user)
    const token = store((state) => state.token)
    const isMedium = useMediaQuery("(min-width: 775px)")
    return (
        <Box>
            <Box display="flex" flexDirection="column" height="100%">
                <NavBar />
                <Box
                    width="100%"
                    padding="1rem 5%"
                    gap="1rem"
                    position="relative"
                    top="70px"
                    display="flex"
                    flexDirection={isMedium ? "row" : "column-reverse"} 
                >
                    <PostProfile token={token} thisUserID={user.user_ID} avatar={user.avatar}/>
                    <InfoUser token={token}/>
                </Box>
            </Box>
        </Box>
    );
}

export default ProfilePage