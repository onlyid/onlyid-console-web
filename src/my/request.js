import axios from "axios"
import { eventEmitter } from "./utils"

export const baseURL = "/api/console"
export const loginUrl =
    "https://onlyid.net/oauth?client-id=98d44b4a3543db79&redirect-uri=https%3A%2F%2Fonlyid.net%2Fconsole%2Foauth-callback"

const request = axios.create({ baseURL })

request.interceptors.response.use(
    (res) => res.data,
    (err) => {
        let errMsg
        if (err.response) {
            if (err.response.status === 401) {
                window.location.replace(loginUrl)
                return
            }

            errMsg = err.response.data.error
        }
        if (!errMsg) errMsg = err.message

        eventEmitter.emit("app/openToast", { text: errMsg, severity: "error" })

        return Promise.reject(err)
    }
)

export default request
