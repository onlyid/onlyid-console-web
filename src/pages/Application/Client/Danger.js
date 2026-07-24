import { useState } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core"
import DangerZone from "components/DangerZone"
import DialogClose from "components/DialogClose"
import http from "my/http"
import { useRouteMatch, useHistory } from "react-router-dom"
import { eventEmitter } from "my/utils"

export default function Danger({ onSave }) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [operation, setOperation] = useState("")
    const history = useHistory()
    const match = useRouteMatch()

    const confirm = (operation) => {
        setOperation(operation)
        setDialogOpen(true)
    }

    const closeDialog = () => {
        setDialogOpen(false)
    }

    const onSubmit = async () => {
        const { params } = match

        let toastText
        if (operation === "delete") {
            await http.delete("clients/" + params.id)
            toastText = "删除成功"
            history.goBack()
        } else {
            await http.put(`clients/${params.id}/secret`)
            toastText = "重置成功"
            onSave()
        }
        closeDialog()
        eventEmitter.emit("app/openToast", { text: toastText, timeout: 2000 })
    }

    let dialogTitle, dialogContent, dialogButtonText
    if (operation === "delete") {
        dialogTitle = "删除应用"
        dialogContent = "删除后不可恢复，确定删除？"
        dialogButtonText = "删 除"
    } else {
        dialogTitle = "重置 Secret"
        dialogContent = "重置后不可还原，确定重置？"
        dialogButtonText = "重 置"
    }

    return (
        <DangerZone>
            <li>
                <div>
                    <h3>删除应用</h3>
                    <p>删除后，和该应用相关的SSO认证产品将立即停止工作</p>
                </div>
                <Button variant="contained" color="secondary" onClick={() => confirm("delete")}>
                    删 除
                </Button>
            </li>
            <li>
                <div>
                    <h3>重置 Secret</h3>
                    <p>一般仅在原secret泄漏时需要重置，重置后原secret马上失效</p>
                </div>
                <Button variant="contained" color="secondary" onClick={() => confirm("rotate")}>
                    重 置
                </Button>
            </li>
            <Dialog open={dialogOpen} onClose={closeDialog}>
                <DialogTitle>
                    {dialogTitle}
                    <DialogClose onClose={closeDialog} />
                </DialogTitle>
                <DialogContent>
                    <p style={{ margin: 0, minWidth: 400 }}>{dialogContent}</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>取 消</Button>
                    <Button onClick={onSubmit} color="secondary">
                        {dialogButtonText}
                    </Button>
                </DialogActions>
            </Dialog>
        </DangerZone>
    )
}
