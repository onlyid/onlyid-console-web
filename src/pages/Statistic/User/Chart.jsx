import { useState, useEffect } from "react"
import request from "@/my/request"
import BaseChart from "../BaseChart"

export default function Chart({ clientId, days, type, typeList }) {
    const [list, setList] = useState([])

    const initData = async () => {
        const params = { days, type }
        if (clientId !== "all") params.clientId = clientId
        const list = await request.get("statistics/users/group-by-date", {
            params
        })
        setList(list)
    }

    useEffect(() => {
        initData()
    }, [clientId, days, type])

    const name = typeList.find((item) => item.value === type).label

    return <BaseChart days={days} list={list} name={name} />
}
