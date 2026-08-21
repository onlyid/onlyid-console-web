import { useState, useEffect } from "react"
import request from "@/my/request"
import { Button } from "@mui/material"
import { useRouteMatch } from "react-router-dom"
import { eventEmitter } from "@/my/utils"
import tipBox from "@/components/TipBox.module.css"

export default function Json() {
    const [user, setUser] = useState({})
    const match = useRouteMatch()

    const initData = async () => {
        const user = await request.get(`users/${match.params.id}`)
        setUser(user)
    }

    useEffect(() => {
        initData()
    }, [])

    useEffect(() => {
        window.Prism.highlightAll()
    }, [user])

    const copy = () => {
        const el = document.createElement("textarea")
        el.value = JSON.stringify(user, null, 4)
        document.body.appendChild(el)
        el.select()
        document.execCommand("copy")
        document.body.removeChild(el)

        eventEmitter.emit("app/openToast", { text: "复制成功", timeout: 2000 })
    }

    const formatted = JSON.stringify(user, null, 4)

    return (
        <>
            <pre style={{ margin: "40px 0 0" }}>
                <code className="language-javascript">{formatted}</code>
            </pre>
            <Button
                color="primary"
                onClick={copy}
                style={{ marginTop: 16 }}
                className="small"
                startIcon={
                    <span className="material-icons" style={{ fontSize: 18 }}>
                        content_copy
                    </span>
                }
            >
                复制
            </Button>
            <div className={tipBox.root}>
                <p>提示：</p>
                <ol>
                    <li>本页展示你的应用使用UserInfo API获取到的用户信息。</li>
                </ol>
            </div>
        </>
    )
}
