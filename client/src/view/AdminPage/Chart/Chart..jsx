import { Box, Stack, Typography, useMediaQuery} from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import { store } from "../../../state/store";
import { getNumberGender } from "../../../services/apiServiceAdmin";
import { useEffect, useState } from "react";

function addValues(obj1, obj2, obj3) {
    let result = {};
    for (let key in obj1) {
        result[key] = (obj1[key] || 0) + (obj2[key] || 0) + (obj3[key] || 0)
        result[key] = result[key] == 0 ? 1 : result[key] 
    }
    return result;
}

function percentageFormatter(value) {
    return `${value}%`;
}

function customRound(n) {
    if (n - Math.floor(n) >= 0.5) {
        return Math.ceil(n * 100) / 100;
    } else {
        return Math.floor(n * 100) / 100;
    }
}

const Chart = () => {
    const [data, setData] = useState({
        data1: [0, 0, 0, 0, 0, 0, 0],
        data2: [0, 0, 0, 0, 0, 0, 0],
        data3: [0, 0, 0, 0, 0, 0, 0],
    })
    const token = store((state) => state.token) 
    const isLong = useMediaQuery("(min-width: 1536px)")
    const isMedium = useMediaQuery("(min-width: 654px)")
    const isMobile = useMediaQuery("(min-width: 440px)")
    useEffect(() => {
        let ignore = false
        const fetchGender = async () => {
            let numData = await getNumberGender(token)
            let res = addValues(numData.output["0"], numData.output["1"], numData.output["2"])
            if(!ignore) {
                setData({
                    data1: [
                        customRound(numData.output["0"]["13-17"] / res["13-17"]) * 100, 
                        customRound(numData.output["0"]["18-24"] / res["18-24"]) * 100, 
                        customRound(numData.output["0"]["25-34"] / res["25-34"]) * 100, 
                        customRound(numData.output["0"]["35-44"] / res["35-44"]) * 100, 
                        customRound(numData.output["0"]["45-54"] / res["45-54"]) * 100,
                        customRound(numData.output["0"]["55-64"] / res["55-64"]) * 100,
                        customRound(numData.output["0"]["65+"] / res["65+"]) * 100
                    ],                    
                    data2: [
                        customRound(numData.output["1"]["13-17"] / res["13-17"]) * 100, 
                        customRound(numData.output["1"]["18-24"] / res["18-24"]) * 100, 
                        customRound(numData.output["1"]["25-34"] / res["25-34"]) * 100, 
                        customRound(numData.output["1"]["35-44"] / res["35-44"]) * 100, 
                        customRound(numData.output["1"]["45-54"] / res["45-54"]) * 100,
                        customRound(numData.output["1"]["55-64"] / res["55-64"]) * 100,
                        customRound(numData.output["1"]["65+"] / res["65+"]) * 100
                    ],
                    data3: [
                        customRound(numData.output["2"]["13-17"] / res["13-17"]) * 100, 
                        customRound(numData.output["2"]["18-24"] / res["18-24"]) * 100, 
                        customRound(numData.output["2"]["25-34"] / res["25-34"]) * 100, 
                        customRound(numData.output["2"]["35-44"] / res["35-44"]) * 100, 
                        customRound(numData.output["2"]["45-54"] / res["45-54"]) * 100,
                        customRound(numData.output["2"]["55-64"] / res["55-64"]) * 100,
                        customRound(numData.output["2"]["65+"] / res["65+"]) * 100
                    ],

                })
                // setNumAllMale(numMale)
                // setNumAllFemale(numFemale)
                // setNumAllOther(numOther)
                // setData(state => [...state, { value: numMale.number, label: "Nam"}, { value: numFemale.number, label: "Nữ" }, { value: numOther.number, label: "Khác" }])
            }
        }
        fetchGender()
        return () => {
            ignore = true
        }
    }, [])
    return (
        <Box display="flex" mt="1rem">
            <BarChart
                xAxis={[{ scaleType: 'band', data: ["13-17", "18-24", "25-34", "35-44", "45-54", "55-64","65+"] }]}
                yAxis={[{
                    label: "tỉ lệ (%)"
                }]}
                series={[
                    { data: data.data1, label: "Nam", valueFormatter: percentageFormatter}, 
                    { data: data.data2, label: "Nữ", valueFormatter: percentageFormatter}, 
                    { data: data.data3, label: "Khác", valueFormatter: percentageFormatter}, 
                ]}
                width={isLong ? 700 : isMedium ? 500 : isMobile ? 300 : 200}
                height={isMedium ? 500 : 300}
            />
        </Box>
    );
}

export default Chart