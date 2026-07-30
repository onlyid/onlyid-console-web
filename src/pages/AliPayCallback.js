import { useEffect } from "react"
import { useHistory, useLocation } from "react-router-dom"
import qs from "qs"
import http from "my/http"
import { eventEmitter } from "../my/utils"
import { CircularProgress } from "@material-ui/core"

export default function AliPayCallback() {
    const history = useHistory()
    const location = useLocation()

    const { search } = location

    useEffect(() => {
        const query = qs.parse(search, { ignoreQueryPrefix: true })
        if (!query["out_trade_no"]) {
            history.replace("/")
            return
        }

        checkRenew(query["out_trade_no"])
    }, [])

    const checkRenew = async (chargeId) => {
        try {
            const tenantInfo = await http.post("tenant/check-pay", { chargeId })
            localStorage.setObj("tenantInfo", tenantInfo)
            eventEmitter.emit("app/openToast", { text: "支付成功", timeout: 2000 })
        } finally {
            history.replace("/tenant/renewal")
        }
    }

    return (
        <div style={{ textAlign: "center", padding: "100px 0" }}>
            <CircularProgress />
        </div>
    )
}
