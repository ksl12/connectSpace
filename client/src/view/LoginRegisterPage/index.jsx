import { Box, Typography, useMediaQuery} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import Form from "./Form";

const LoginRegisterPage = () => {
    const theme = useTheme()
    const light = theme.colorSchemes.light
    const isNonMobile = useMediaQuery("(min-width: 900px)")
    return (
        <Box
            height = "100%"
        >
            <Box
                width = "100%"
                height = "100%"
                bgcolor = {light.palette.background.alt}
                p = "1rem 6%"
                textAlign = "center"
            >
                <Typography fontWeight = "bold" fontSize = "30px" color = "primary">
                    ConnectSpace
                </Typography>
                <Box
                    width = {isNonMobile ? "50%" : "90%"}
                    p = "1.5rem"
                    m = "1rem auto"
                    borderRadius = "1rem"
                    border = "1px solid"
                    borderColor = "rgb(219, 219, 219)"
                    bgcolor = {light.palette.background.alt}
                    display = "flex"
                    flexDirection = "column"
                >
                    <Typography
                        fontWeight = "500"
                        variant = "h3"
                        color = "rgb(115, 115, 115)"
                        sx={{ mb: "1.5rem"}}
                    >
                        Đăng Nhập để kết nối với mọi người
                    </Typography>
                    <Form/>
                </Box>
            </Box>
        </Box>
    )
}

export default LoginRegisterPage
