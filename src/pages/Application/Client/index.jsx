import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import MainHeader from "@/components/MainHeader"
import request from "@/my/request"
import { useRouteMatch } from "react-router-dom"
import { CLIENT_TYPE_TEXT, IMG_UPLOAD_TIP } from "@/my/constants"
import mainTabs from "@/components/MainTabs.module.css"
import { Tab, Tabs } from "@material-ui/core"
import Basic from "./Basic"
import Otp from "./Otp"
import OAuth from "./OAuth"
import Danger from "./Danger"
import { eventEmitter } from "@/my/utils"

export default function Client() {
    const [client, setClient] = useState({})

    const application = useSelector((state) => state.application)
    const dispatch = useDispatch()
    const match = useRouteMatch()

    useEffect(() => {
        initData()
    }, [])

    const initData = async () => {
        const client = await request.get(`clients/${match.params.id}`)
        setClient(client)
    }

    const onTabChange = (event, value) => {
        dispatch({ type: "application", currentTab: value })
    }

    const onUpload = async (filename) => {
        const { iconUrl } = await request.put(`clients/${match.params.id}/icon`, { filename })
        setClient((client) => ({ ...client, iconUrl }))
        eventEmitter.emit("app/openToast", { text: "保存成功", timeout: 2000 })
    }

    let content
    switch (application.currentTab) {
        case "otp":
            content = <Otp />
            break
        case "oauth":
            content = <OAuth clientType={client.type} />
            break
        case "danger":
            content = <Danger onSave={initData} />
            break
        default:
            content = <Basic client={client} onSave={initData} />
    }

    return (
        <>
            <MainHeader
                backText="返回应用列表"
                imgUrl={client.iconUrl}
                title={client.name}
                uploadTip={IMG_UPLOAD_TIP}
                onUpload={onUpload}
            >
                <ul>
                    <li>
                        <span>ID：</span>
                        <span className="spanId">{client.id}</span>
                    </li>
                    <li>
                        <span>类型：</span>
                        {CLIENT_TYPE_TEXT[client.type]}
                    </li>
                </ul>
            </MainHeader>
            <Tabs
                value={application.currentTab}
                onChange={onTabChange}
                indicatorColor="primary"
                className={mainTabs.root}
            >
                <Tab label="应用详情" value="basic" />
                <Tab label="OAuth 设置" value="oauth" />
                <Tab label="危险设置" value="danger" />
            </Tabs>
            {content}
        </>
    )
}
