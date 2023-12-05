import { Box } from "@mui/material";
import NavBar from "../../components/NavBar/NavBar";
import NotificationAll from "../NotificationAll";



const NotificationPage = () => {
    return (
        <Box display="flex" flexDirection="column" height="100%">
            <NavBar />
            <NotificationAll />
        </Box>
    );
}

export default NotificationPage