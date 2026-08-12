import { useState, useEffect } from "react"
import EmptyPage from "components/EmptyPage"
import MainActionBox from "./MainActionBox"
import SelectBar from "./SelectBar"
import request from "my/request"
import UserTable from "./UserTable"
import { useSelector, useDispatch } from "react-redux"
import tipBox from "components/TipBox.module.css"
import { useRouteMatch, useHistory } from "react-router-dom"

export default function Home() {
    const [loading, setLoading] = useState(true)
    const [showEmpty, setShowEmpty] = useState(false)
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const history = useHistory()
    const match = useRouteMatch()

    const { current, pageSize } = user

    useEffect(() => {
        initData()
    }, [current, pageSize])

    const initData = async () => {
        const { current, pageSize, keyword, clientId, orderBy } = user

        setLoading(true)

        const params = { current, pageSize, keyword, orderBy }
        if (clientId !== "all") params.clientId = clientId

        const { list, total } = await request.get("users", { params })
        if (list.length || current === 1) {
            dispatch({ type: "user", list, total, realOrderBy: orderBy })
            setLoading(false)

            // 当筛选条件不生效，列表仍然为空，那么就展示空页
            if (!list.length && clientId === "all" && !keyword) setShowEmpty(true)
        } else {
            dispatch({ type: "user", current: current - 1 })
        }
    }

    const goBlacklist = () => {
        history.push(`${match.url}/blacklist`)
    }

    const onClientChange = (clientId) => {
        dispatch({ type: "user", clientId })
    }

    const onChange = ({ target }) => {
        dispatch({ type: "user", [target.name]: target.value })
    }

    const onSearch = () => {
        // current=1时，手动发起请求
        if (current === 1) initData()
        else dispatch({ type: "user", current: 1 })
    }

    const onPaginationChange = ({ pageSize, current }) => {
        dispatch({ type: "user", pageSize, current })
    }

    const { clientId, orderBy, keyword, list, total, realOrderBy } = user

    if (showEmpty)
        return (
            <EmptyPage
                title="用户列表"
                icon="person"
                description="暂无用户；应用接入SSO后，登录的用户会出现在本页"
            />
        )

    return (
        <>
            <MainActionBox goBlacklist={goBlacklist} />
            <h1>用户列表</h1>
            <p>提供基础的用户管理功能，如查看应用新增用户、禁止恶意用户登录等</p>
            <SelectBar
                clientId={clientId}
                orderBy={orderBy}
                keyword={keyword}
                onChange={onChange}
                onClientChange={onClientChange}
                onSearch={onSearch}
            />
            <UserTable
                list={list}
                loading={loading}
                current={current}
                pageSize={pageSize}
                total={total}
                onPaginationChange={onPaginationChange}
                orderBy={realOrderBy}
            />
            <div className={tipBox.root} style={{ marginTop: 20 }}>
                <p>提示：</p>
                <ol>
                    <li>
                        当排序筛选栏选择 "最近新增"
                        时，右侧登录应用是指该用户新增时登录的应用，而不是最近一次登录的应用。
                    </li>
                </ol>
            </div>
        </>
    )
}
