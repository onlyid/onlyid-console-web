import { useEffect, useState } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import DangerZone from "@/components/DangerZone"
import DialogClose from "@/components/DialogClose"
import request from "@/my/request"
import { useRouteMatch } from "react-router-dom"
import { eventEmitter } from "@/my/utils"
import styles from "./index.module.css"
import tipBox from "@/components/TipBox.module.css"

const BlockDialog = ({ open, blocked, onCancel, onSubmit }) => {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>
                {blocked ? "移出黑名单" : "加入黑名单"}
                <DialogClose onClose={onCancel} />
            </DialogTitle>
            <DialogContent className={styles.blockDialog}>
                <p>
                    {blocked
                        ? "移出黑名单后，该用户就可以登录你名下的所有应用。"
                        : "加入黑名单后，该用户将不能登录你名下的所有应用。"}
                </p>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>取 消</Button>
                <Button onClick={onSubmit} color="secondary">
                    {blocked ? "移 出" : "拉 黑"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default function Danger() {
    const [blockOpen, setBlockOpen] = useState(false)
    const [blocked, setBlocked] = useState(false)
    const match = useRouteMatch()

    const initData = async () => {
        const { blocked } = await request.get(`users/${match.params.id}/check-blocked`)
        setBlocked(blocked)
    }

    useEffect(() => {
        initData()
    }, [])

    const toggleBlock = () => {
        setBlockOpen((prev) => !prev)
    }

    const onSubmit = async () => {
        let toastText
        if (blocked) {
            await request.post(`users/${match.params.id}/unblock`)
            toastText = "移出黑名单成功"
        } else {
            await request.post(`users/${match.params.id}/block`)
            toastText = "加入黑名单成功"
        }

        toggleBlock()
        initData()
        eventEmitter.emit("app/openToast", { text: toastText, timeout: 3000 })
    }

    return (
        <>
            <DangerZone>
                <li>
                    <div>
                        <h3>{blocked ? "已加黑名单" : "加入黑名单"}</h3>
                        <p>
                            {blocked
                                ? "已经将用户加入黑名单，TA不能登录你名下的所有应用"
                                : "将恶意用户加入黑名单，禁止TA登录你名下的所有应用"}
                        </p>
                    </div>
                    <Button variant="contained" color="secondary" onClick={toggleBlock}>
                        {blocked ? "移 出" : "拉 黑"}
                    </Button>
                </li>
            </DangerZone>
            <div className={tipBox.root}>
                <p>提示：</p>
                <ol>
                    <li>
                        将黑名单用户移出黑名单后，只有等该用户再次登录你名下任一应用，才会重新进入用户管理列表。
                    </li>
                </ol>
            </div>
            <BlockDialog
                open={blockOpen}
                blocked={blocked}
                onCancel={toggleBlock}
                onSubmit={onSubmit}
            />
        </>
    )
}
