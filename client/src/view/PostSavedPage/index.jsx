import { Box, Stack} from "@mui/material";
import NavBar from "../../components/NavBar/NavBar";
import AllPostSaved from "../../components/AllPostSaved";


const PostSavedPage = () => {
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
                <AllPostSaved />
            </Box>
        </Stack>
    );
}

export default PostSavedPage