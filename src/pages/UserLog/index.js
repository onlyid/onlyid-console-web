import { useState, useEffect } from "react"
import styles from "./index.module.css"
import http from "my/http"
import SelectBar from "./SelectBar"
import UserActiveTable from "./UserActiveTable"

export default function UserLog() {
    const [list, setList] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [keyword, setKeyword] = useState("")
    const [clientId, setClientId] = useState("all")
    const [gteDate, setGteDate] = useState("")
    const [lteDate, setLteDate] = useState("")
    const [success, setSuccess] = useState("all")

    useEffect(() => {
        initData()
    }, [current, pageSize])

    const initData = async () => {
        setLoading(true)

        const params = { current, pageSize, keyword }
        if (clientId !== "all") params.clientId = clientId
        if (success !== "all") params.success = success
        if (gteDate) params.gteDate = gteDate
        if (lteDate) params.lteDate = lteDate

        const { list, total } = await http.get("user-logs", { params })
        setList(list)
        setTotal(total)
        setLoading(false)
    }

    const onClientChange = (clientId) => {
        setClientId(clientId)
    }

    const onChange = ({ target }) => {
        const setters = {
            keyword: setKeyword,
            gteDate: setGteDate,
            lteDate: setLteDate,
            success: setSuccess
        }
        setters[target.name](target.value)
    }

    const onSearch = () => {
        // current=1时，手动发起请求
        if (current === 1) initData()
        else setCurrent(1)
    }

    const onPaginationChange = ({ pageSize, current }) => {
        setPageSize(pageSize)
        setCurrent(current)
    }

    return (
        <div className={styles.root}>
            <h1>登录日志</h1>
            <p>
                查看最近的用户登录行为日志
                <span style={{ color: "#7f7f7f" }}>（保留三个月数据）</span>
            </p>
            <SelectBar
                clientId={clientId}
                lteDate={lteDate}
                gteDate={gteDate}
                success={success}
                keyword={keyword}
                onClientChange={onClientChange}
                onChange={onChange}
                onSearch={onSearch}
            />
            <UserActiveTable
                list={list}
                loading={loading}
                current={current}
                pageSize={pageSize}
                total={total}
                onPaginationChange={onPaginationChange}
            />
        </div>
    )
}
