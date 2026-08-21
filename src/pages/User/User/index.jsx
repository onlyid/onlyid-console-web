import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouteMatch, useLocation } from "react-router-dom"
import request from "@/my/request"
import MainHeader from "@/components/MainHeader"
import { Tab, Tabs } from "@material-ui/core"
import mainTabs from "@/components/MainTabs.module.css"
import Info from "./Info"
import Json from "./Json"
import ClientTable from "./ClientTable"
import Danger from "./Danger"

export default function User() {
    const [user, setUser] = useState({})
    const match = useRouteMatch()
    const location = useLocation()
    const dispatch = useDispatch()
    const { currentTab } = useSelector((state) => state.user)

    const initData = async () => {
        const user = await request.get(`users/${match.params.id}`)
        setUser(user)
    }

    useEffect(() => {
        initData()
    }, [])

    const onTabChange = (event, value) => {
        dispatch({ type: "user", currentTab: value })
    }

    const { state } = location

    let content
    switch (currentTab) {
        case "json":
            content = <Json />
            break
        case "client":
            content = <ClientTable />
            break
        case "danger":
            content = <Danger />
            break
        default:
            content = <Info user={user} />
    }

    return (
        <>
            <MainHeader
                backText={state && state.fromBlacklist ? "返回黑名单" : "返回用户列表"}
                imgUrl={user.avatar}
                title={user.nickname}
            >
                <ul>
                    <li>
                        <span>ID：</span>
                        <span className="spanId">{user.id}</span>
                    </li>
                    <li>
                        <span>手机号：</span>
                        <span>{user.mobile || "-"}</span>
                    </li>
                    <li>
                        <span>邮箱：</span>
                        <span>{user.email || "-"}</span>
                    </li>
                </ul>
            </MainHeader>
            <Tabs
                value={currentTab}
                onChange={onTabChange}
                indicatorColor="primary"
                className={mainTabs.root}
            >
                <Tab label="账号详情" value="basic" />
                <Tab label="预览 JSON" value="json" />
                <Tab label="授权应用" value="client" />
                <Tab label="危险设置" value="danger" />
            </Tabs>
            {content}
        </>
    )
}
