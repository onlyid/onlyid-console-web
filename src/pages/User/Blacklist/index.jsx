import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import styles from "./index.module.css"
import { Button } from "@mui/material"
import SelectBar from "./SelectBar"
import ArrowBack from "@mui/icons-material/ArrowBack"
import request from "@/my/request"
import UserTable from "./UserTable"

export default function Blacklist() {
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const history = useHistory()

    const { bl_current, bl_pageSize } = user

    const initData = async () => {
        const { bl_keyword } = user

        setLoading(true)
        const params = { current: bl_current, pageSize: bl_pageSize, keyword: bl_keyword }
        const { list, total } = await request.get("users/blacklist", { params })

        if (list.length || bl_current === 1) {
            dispatch({ type: "user", bl_list: list, bl_total: total })
            setLoading(false)
        } else {
            dispatch({ type: "user", bl_current: bl_current - 1 })
        }
    }

    useEffect(() => {
        initData()
    }, [bl_current, bl_pageSize])

    const goBack = () => {
        history.goBack()
    }

    const onChange = ({ target }) => {
        dispatch({ type: "user", [target.name]: target.value })
    }

    const onSearch = () => {
        // current=1时，手动发起请求
        if (bl_current === 1) initData()
        else dispatch({ type: "user", bl_current: 1 })
    }

    const onPaginationChange = ({ pageSize, current }) => {
        dispatch({ type: "user", bl_pageSize: pageSize, bl_current: current })
    }

    const { bl_list, bl_total, bl_keyword } = user

    return (
        <>
            <Button
                onClick={goBack}
                startIcon={<ArrowBack />}
                size="small"
                className={styles.backButton}
            >
                返回用户列表
            </Button>
            <h1>黑名单</h1>
            <p>加入黑名单的用户不能登录你名下的所有应用</p>
            <SelectBar keyword={bl_keyword} onChange={onChange} onSearch={onSearch} />
            <UserTable
                list={bl_list}
                loading={loading}
                current={bl_current}
                pageSize={bl_pageSize}
                total={bl_total}
                onPaginationChange={onPaginationChange}
            />
        </>
    )
}
