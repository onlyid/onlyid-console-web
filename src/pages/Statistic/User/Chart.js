import { useState, useEffect } from "react"
import http from "my/http"
import BaseChart from "../BaseChart"

export default function Chart({ clientId, days, type, typeList }) {
    const [list, setList] = useState([])

    useEffect(() => {
        initData()
    }, [clientId, days, type])

    const initData = async () => {
        const params = { days, type }
        if (clientId !== "all") params.clientId = clientId
        const list = await http.get("statistics/users/group-by-date", {
            params
        })
        setList(list)
    }

    const name = typeList.find((item) => item.value === type).label

    return <BaseChart days={days} list={list} name={name} />
}
