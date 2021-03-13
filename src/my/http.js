import axios from "axios";
import { eventEmitter } from "./utils";

export const baseURL = "/api";
export const loginUrl =
    "https://www.onlyid.net/oauth?client-id=07c9770f22b1460398d44b4a3543db79&redirect-uri=https%3A%2F%2Fwww.onlyid.net%2Fconsole%2Foauth-callback";

const instance = axios.create({ baseURL });

instance.interceptors.response.use(
    res => res.data,
    err => {
        let errMsg;
        if (err.response) {
            if (err.response.status === 401) {
                window.location.replace(loginUrl);
                return;
            }

            errMsg = err.response.data.error;
        } else {
            errMsg = err.message;
        }
        eventEmitter.emit("app/openToast", { text: errMsg, severity: "error" });

        return Promise.reject(err);
    }
);

export default instance;
