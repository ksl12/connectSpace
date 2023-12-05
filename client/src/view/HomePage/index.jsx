import { Box, Stack} from "@mui/material";
import NavBar from "../../components/NavBar/NavBar";
import PostPage from "../../components/PostPage/PostPage";
import FriendSuggestion from "../../components/FriendSuggestion"
const HomePage = () => {
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
            >
                <PostPage />
                <FriendSuggestion />
            </Box>
        </Stack>
    );
}

export default HomePage