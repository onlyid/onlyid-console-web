import { useState, useEffect } from "react"
import request from "@/my/request"
import { Button } from "@material-ui/core"
import { Add as AddIcon } from "@material-ui/icons"
import EmptyPage from "@/components/EmptyPage"
import CreateDialog from "./CreateDialog"
import ClientTable from "./ClientTable"
import moment from "moment"
import WelcomeDialog from "./WelcomeDialog"

export default function Home() {
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const [createOpen, setCreateOpen] = useState(false)
    const [welcomeOpen, setWelcomeOpen] = useState(false)

    useEffect(() => {
        initData()

        const tenantInfo = localStorage.getObj("tenantInfo")
        if (moment(tenantInfo.createDate) > moment().subtract(5, "seconds")) setWelcomeOpen(true)
    }, [])

    const initData = async () => {
        setLoading(true)
        const list = await request.get("clients")
        setList(list)
        setLoading(false)
    }

    const openCreate = () => {
        setCreateOpen(true)
    }

    const cancelCreate = () => {
        setCreateOpen(false)
    }

    const saveCreate = () => {
        setCreateOpen(false)
        initData()
    }

    const closeWelcome = () => {
        setWelcomeOpen(false)
    }

    const createNew = (
        <>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={openCreate}
            >
                新建应用
            </Button>
            <CreateDialog
                open={createOpen}
                onCancel={cancelCreate}
                onSave={saveCreate}
                key={createOpen}
            />
        </>
    )

    if (!list.length && !loading)
        return (
            <EmptyPage title="应用管理" icon="apps" description="暂无应用，请新建">
                {createNew}
                <WelcomeDialog open={welcomeOpen} onClose={closeWelcome} onCreate={openCreate} />
            </EmptyPage>
        )

    return (
        <>
            <div className="mainActionBox">{createNew}</div>
            <h1>应用管理</h1>
            <p>新建一个应用来使用唯ID的认证产品</p>
            <ClientTable list={list} loading={loading} />
        </>
    )
}
