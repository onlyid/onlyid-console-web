import { PureComponent } from "react"
import { Tooltip } from "@mui/material"
import { eventEmitter } from "@/my/utils"

export default class CopyButton extends PureComponent {
    copy = () => {
        const { value } = this.props

        const el = document.createElement("textarea")
        el.value = value
        document.body.appendChild(el)
        el.select()
        document.execCommand("copy")
        document.body.removeChild(el)

        eventEmitter.emit("app/openToast", { text: "复制成功", timeout: 2000 })
    }

    render() {
        return (
            <Tooltip title="复制">
                <div className="inputEndButton" onClick={this.copy}>
                    <span className="material-icons">content_copy</span>
                </div>
            </Tooltip>
        )
    }
}
