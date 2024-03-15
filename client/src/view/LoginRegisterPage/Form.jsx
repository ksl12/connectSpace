import * as yup from "yup"
import {Formik, replace} from "formik"
import { useState } from "react"
import {useMediaQuery, Box, TextField, FormControl, FormLabel, FormControlLabel, RadioGroup, Radio, Button, Typography} from "@mui/material"
import {useTheme} from '@mui/material/styles';
import {useNavigate} from "react-router-dom"
import {AdapterDayjs}  from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider}  from "@mui/x-date-pickers/LocalizationProvider";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs"
import {login, logout, register} from "../../services/apiServicesAuth"
import { store } from "../../state/store"

const conditionRegister = yup.object().shape({
    username: yup.string().trim("Tài khoản không được có khoảng trắng").required("Tài khoản không được để trống").min(3, "Tài khoản phải có ít nhất 3 ký tự").max(50, "Tài Khoản không vượt quá 50 ký tự"),
    password: yup.string().required("Mật khẩu không được để trống").min(6, "Mật khẩu phải có ít nhất 6 ký tự").max(25, "Mật Khẩu không vượt quá 25 ký tự")
    .matches(/[ -~]*[a-z][ -~]*/, "Mật Khẩu phải có ít nhất 1 ký tự viết thường") // at least 1 lower-case
    .matches(/[ -~]*[A-Z][ -~]*/, "Mật Khẩu phải có ít nhất 1 ký tự viết hoa") // at least 1 upper-case
    .matches(/[ -~]*(?=[ -~])[^0-9a-zA-Z][ -~]*/, "Mật Khẩu phải có ít nhất 1 ký tự đặc biệt") // basically: [ -~] && [^0-9a-zA-Z], at least 1 special character
    .matches(/[ -~]*[0-9][ -~]*/, "Mật Khẩu phải có ít nhất 1 số"), // at least 1 number
    firstName: yup.string().trim("Không được để trống").required("Họ không được để trống").min(3, "Không được dưới 3 ký tự").max(50, "Không được trên 50 ký tự"),
    lastName: yup.string().trim("Không được để trống").required("Tên không được để trống").min(3, "Không được dưới 3 ký tự").max(50, "Không được trên 50 ký tự"),
    email: yup.string().trim("Không được chứa khoảng trắng").required("Email không được để trống").email("Email không đúng định dạng"),
    phoneNumber: yup.string().matches(/^\d{10}$/).required("Bắt buộc").min(10, "Số điện thoại phải đủ 10 chữ số").max(10, "Số điện thoại phải đủ 10 chữ số"),
    dateOFBirth: yup.date(dayjs()).nullable().max(dayjs(new Date()), "Ngày nhập không được lớn hơn hôm nay").required("Không được để trống"), // MM-DD-YYYY
    gender: yup.number().nullable().required("Bắt buộc").min(0).max(2)
})


const conditionLogin = yup.object().shape({
    username: yup.string().trim("Tài khoản không được có khoảng trắng").required("Tài khoản không được để trống").min(3, "Tài khoản phải có ít nhất 3 ký tự").max(50, "Tài Khoản không vượt quá 50 ký tự"),
    password: yup.string().required("Mật khẩu không được để trống").min(6, "Mật khẩu phải có ít nhất 6 ký tự").max(25, "Mật Khẩu không vượt quá 25 ký tự")
    .matches(/[ -~]*[a-z][ -~]*/, "Mật Khẩu phải có ít nhất 1 ký tự viết thường") // at least 1 lower-case
    .matches(/[ -~]*[A-Z][ -~]*/, "Mật Khẩu phải có ít nhất 1 ký tự viết hoa") // at least 1 upper-case
    .matches(/[ -~]*(?=[ -~])[^0-9a-zA-Z][ -~]*/, "Mật Khẩu phải có ít nhất 1 ký tự đặc biệt") // basically: [ -~] && [^0-9a-zA-Z], at least 1 special character
    .matches(/[ -~]*[0-9][ -~]*/, "Mật Khẩu phải có ít nhất 1 số"), // at least 1 number
})

// initial value for formik
const initialValuesRegister = {
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: 0,
    dateOFBirth: dayjs()
};

const initialValuesLogin = {
    username: "",
    password: "",
};


const Form = () => {
    const [pageType, setPageType] = useState("login")
    const theme = useTheme()
    const light = theme.colorSchemes.light
    const navigate = useNavigate()
    const isNonMobile = useMediaQuery("(min-width: 600px)")
    const isLongScreen = useMediaQuery("(min-width: 900px)")
    const isSuperLongScreen = useMediaQuery("(min-width: 1100px)")
    const isLogin = pageType === "login"
    const isRegister = pageType === "register"
    const setRole = store((state) => state.setRole)
    const setToken = store((state) => state.setToken)
    const setBlock = store((state) => state.setBlock)
    const registerUser = async (values, propsSubmit) => {
        try {
            const formData = new FormData()
            for (let value in values) {
                formData.append(value, values[value])
            }
            const newUser = await register(formData)
            propsSubmit.resetForm()
            if(newUser) {
                setPageType("login")
            }
        } catch (error) {
            if(error.response.data.messages) {
                alert(error.response.data.messages)
            }
            else {
                alert(error.response.data.errors)
            }
        }
    }

    
    const loginUser = async (values, propsSubmit) => {
        try {
            const savedUser = await login(values)
            propsSubmit.resetForm()
            if(savedUser.user.isBlock == 1) {
                await logout()
                setToken({}, savedUser.access_token)
                setBlock(1)
                navigate("/", { replace: true })
            }
            else {
                if(savedUser) {
                    setToken(savedUser.user, savedUser.access_token)
                    setRole(savedUser.user.role[0].role_ID )
                    setBlock(savedUser.user.isBlock)
                }
            }
        } catch (error) {
            // console.log(error);
            if(error.response.data.messages == undefined) {
                alert("Không được đăng nhập")
            } else {
                alert(error.response.data.messages)
            }
        }
    }
    const handleFormSubmit = async (values, propsSubmit) => {
        if(isLogin) await loginUser(values, propsSubmit) 
        if(isRegister) await registerUser(values, propsSubmit)
    }
    return (
       <Formik
            enableReinitialize
            onSubmit={handleFormSubmit}
            initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
            validationSchema={isLogin ? conditionLogin : conditionRegister}
       >
            {
                ({// prop formil
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    setFieldValue,
                    resetForm
                }) => (
                    <form onSubmit={handleSubmit}>
                        <Box
                            display= "flex"
                            flexDirection= "column"
                            alignItems= "center"
                            justifyContent= "space-between"
                            gap= "12px"
                            // sx={{
                            //     "& > div": {}
                            // }}
                        >   
                            <Box
                                display= "flex"
                                flexDirection= "column"
                                alignItems= "center"
                                justifyContent= "space-between"
                                gap = "15px"
                            >
                                <TextField
                                    style={{width: isNonMobile && isLogin ? "200%" : "100%"}}
                                    label = "Tài Khoản"
                                    onBlur = {handleBlur}
                                    onChange = {handleChange}
                                    value = {values.username}
                                    name = "username"
                                    error = {
                                        Boolean(touched.username) && Boolean(errors.username)
                                    } 
                                    helperText = {touched.username && errors.username}
                                    autoComplete= "off"
                                />
                                <TextField 
                                    label = "Mật Khẩu"
                                    style={{width: isNonMobile && isLogin ? "200%" : "100%"}}
                                    type="password"
                                    onBlur = {handleBlur}
                                    onChange = {handleChange}
                                    value = {values.password}
                                    name = "password"
                                    error = {
                                        Boolean(touched.password) && Boolean(errors.password)
                                    } 
                                    helperText = {touched.password && errors.password}
                                    autoComplete= "off"
                                />
                                {isRegister && (
                                    <>
                                        <Box
                                            display = "flex"
                                            justifyContent = "center"
                                            gap = "5%"
                                            alignItems = "center" 
                                            flex = "1"
                                        >
                                            <TextField 
                                                label = "Họ"
                                                onBlur = {handleBlur}
                                                onChange = {handleChange}
                                                value = {values.firstName || ""}
                                                name = "firstName"
                                                error = {
                                                    Boolean(touched.firstName) && Boolean(errors.firstName)
                                                } 
                                                helperText = {touched.firstName && errors.firstName}
                                                autoComplete= "off"
                                            />
                                            
                                            <TextField 
                                                label = "Tên"
                                                onBlur = {handleBlur}
                                                onChange = {handleChange}
                                                value = {values.lastName || ""}
                                                name = "lastName"
                                                error = {
                                                    Boolean(touched.lastName) && Boolean(errors.lastName)
                                                } 
                                                helperText = {touched.lastName && errors.lastName}
                                                autoComplete= "off"
                                            />
                                        </Box>
                                        <TextField 
                                            fullWidth
                                            label = "Email"
                                            onBlur = {handleBlur}
                                            onChange = {handleChange}
                                            value = {values.email || ""}
                                            name = "email"
                                            error = {
                                                Boolean(touched.email) && Boolean(errors.email)
                                            } 
                                            helperText = {touched.email && errors.email}
                                            autoComplete= "off"
                                        />
                                        <TextField 
                                            fullWidth
                                            label = "Số điện thoại"
                                            onBlur = {handleBlur}
                                            onChange = {handleChange}
                                            value = {values.phoneNumber || ""}
                                            name = "phoneNumber"
                                            error = {
                                                Boolean(touched.phoneNumber) && Boolean(errors.phoneNumber)
                                            } 
                                            helperText = {touched.phoneNumber && errors.phoneNumber}
                                            autoComplete= "off"
                                        />
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label = "Ngày sinh (MM/DD/YYYY)"
                                                name = "dateOFBirth"
                                                format="MM/DD/YYYY"
                                                maxDate={dayjs(new Date())}
                                                value={dayjs(values.dateOFBirth) || dayjs()}
                                                onBlur = {handleBlur}
                                                onChange={(date) => {
                                                    setFieldValue("dateOFBirth", date)}
                                                }
                                                slotProps={
                                                    { textField: 
                                                        {placeholder: "MM/DD/YYYY", 
                                                        fullWidth: true, 
                                                        error: Boolean(touched.dateOFBirth) && Boolean(errors.dateOFBirth),
                                                        helperText: touched.dateOFBirth && errors.dateOFBirth,
                                                        InputLabelProps: {style: {fontSize: "15px", fontWeight: "bold"}}
                                                        }
                                                    }}
                                                render
                                            />
                                        </LocalizationProvider>
                                        <FormControl component="fieldset">
                                            <FormLabel component="legend" sx={{fontSize: "1rem", fontWeight: "700"}}>Giới tính</FormLabel>
                                            <RadioGroup
                                                row
                                                aria-label="Giới tính"
                                                name="gender"
                                                value={values.gender || 0}
                                                onChange={handleChange}
                                                onBlur = {handleBlur}
                                            >   
                                                <FormControlLabel value={0} control={<Radio />} label="Nam" /> 
                                                <FormControlLabel value={1} control={<Radio />} label="Nữ" />
                                                <FormControlLabel value={2} control={<Radio />} label="Khác" />
                                            </RadioGroup>
                                            {touched.gender && errors.gender ? (
                                                <div>{touched.gender && errors.gender}</div>)
                                                : null
                                            }
                                        </FormControl>
                                    </>
                                )}
                            </Box>
                            {/* Button submit and switch between login and register page */}
                            <Box
                                sx={{minWidth: isSuperLongScreen ? "50%" : isLongScreen ? "90%" : isNonMobile ? "60%" : "45%"}}
                            >
                                <Button
                                    fullWidth
                                    type="submit"
                                    sx={{
                                        p: "1rem",
                                        backgroundColor: light.palette.primary.main,
                                        color: light.palette.background.alt,
                                        "&:hover": { 
                                            color: light.palette.background.light,
                                            bgcolor: light.palette.neutral.main
                                        },
                                    }}
                                >
                                    {isLogin ? "Đăng nhập" : "Đăng Ký"}
                                </Button>
                                <Typography
                                    onClick={() => {
                                        setPageType(isLogin ? "register" : "login");
                                        resetForm();
                                    }}
                                    sx={{
                                        textDecoration: "underline",
                                        color: light.palette.primary.main,
                                        textDecorationLine: "none",
                                        fontSize: "1rem",
                                        mt: "10px",
                                        color: light.palette.neutral.main,
                                        "&:hover": {
                                            cursor: "pointer",
                                            color: light.palette.primary.dark,
                                        },
                                    }}
                                >
                                    {isLogin
                                        ? "Chưa có tài khoản? Đăng ký tại đây."
                                        : "Đã có tài khoản? Đăng nhập tại đây."}
                                </Typography>
                            </Box>
                        </Box>
                    </form>
                )
            }
       </Formik>
    )
}

export default Form