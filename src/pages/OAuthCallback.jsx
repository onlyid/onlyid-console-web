import { useEffect } from "react"
import { useHistory, useLocation } from "react-router-dom"
import qs from "qs"
import request from "@/my/request"
import { eventEmitter } from "@/my/utils"
import moment from "moment"
import { CircularProgress } from "@material-ui/core"

export default function OAuthCallback() {
    const history = useHistory()
    const location = useLocation()

    const { search } = location

    useEffect(() => {
        const query = qs.parse(search, { ignoreQueryPrefix: true })
        if (!query.code) {
            history.replace("/")
            return
        }

        login(query.code)
    }, [])

    const login = async (code) => {
        const { userInfo, tenantInfo } = await request.post("login", { code })
        localStorage.setObj("userInfo", userInfo)
        localStorage.setObj("tenantInfo", tenantInfo)
        eventEmitter.emit("app/login")

        if (moment(tenantInfo.expireDate) < moment()) {
            history.replace("/tenant/renewal")
            eventEmitter.emit("app/openToast", { text: "服务已到期，请续费", severity: "warning" })
        } else if (moment(tenantInfo.createDate) > moment().subtract(5, "seconds")) {
            history.replace("/applications")
        } else {
            history.replace("/")
        }
    }

    return (
        <div style={{ textAlign: "center", padding: "100px 0" }}>
            <CircularProgress />
        </div>
    )
}
