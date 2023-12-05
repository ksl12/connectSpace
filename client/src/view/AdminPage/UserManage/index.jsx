import { Box, Stack, Typography } from "@mui/material";
import NavBarAdmin from "../NavBarAdmin";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs"
import "dayjs/locale/vi"
import utc from "dayjs/plugin/utc"
import relativeTime from "dayjs/plugin/relativeTime"
import timezone from 'dayjs/plugin/timezone';
import { useEffect, useState } from "react";
import { store } from "../../../state/store";
import { listUser } from "../../../services/apiServiceAdmin";
import BlockUser from "../BlockUser/BlockUser";

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale("vi")

const columns = [
    { field: "id", headerName: "ID", flex: 1},
    { field: "firstName", headerName: "Họ", flex: 1 },
    { field: "lastName", headerName: "Tên", flex: 1 },
    {
      field: "age",
      headerName: "Tuổi",
      type: "number",
      flex: 1,
      headerAlign: "left",
      align: "left"
    },
    {
        field: "createAT",
        headerName: "Ngày Tạo",
        flex: 1,
    },
    {
        field: "action",
        headerName: "Khóa người dùng",
        sortable: false,
        flex: 1,
        filterable: false,
        renderCell: (params) => {
            return (
                <BlockUser userID={params.row.id}/>
            )
        } 
    }
];

const UserManage = () => {
    const [rowData, setRowData] = useState([])
    const token = store((state) => state.token) 
    useEffect(() => {
        let ignore = false
        const fetchRowData = async () => {
            let data = await listUser(token)
            let dataRow = []
            for(let user of data) {
                dataRow.push(
                    {
                        id: user.user_ID,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        age: user.age,
                        createAT: dayjs.utc(user.createAt).tz('Asia/Bangkok').format("DD/MM/YYYY [lúc] HH:mm") 
                    }
                )
            }
            if(!ignore) {
                setRowData(dataRow)
            }
        }
        fetchRowData()
        return () => {
            ignore = true
        }
    }, [])
    return (
        <Stack position="relative" height="100%" >
            <NavBarAdmin />
            <Box
                width="100%"
                padding="1rem 5%"
                gap="1rem"
                position="relative"
                top="70px"
                display="flex"
                flexWrap="wrap"
            >
                {rowData.length > 0 ?
                    <DataGrid 
                        disableRowSelectionOnClick
                        disableColumnFilter
                        rows={rowData}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 }
                            }
                        }}
                        pageSizeOptions={[5, 10]}
                    />
                    :
                    <Typography>Hiện chưa có người dùng</Typography>
                }
            </Box>
        </Stack>
    );
}

export default UserManage