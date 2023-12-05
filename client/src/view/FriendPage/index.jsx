import { Box } from "@mui/material";
import NavBar from "../../components/NavBar/NavBar";
import FriendList from "../../components/FriendList";


const FriendPage = () => {
    return (
        <Box display="flex" flexDirection="column" height="100%">
            <NavBar />
            <FriendList />
        </Box>
    );
}

export default FriendPage