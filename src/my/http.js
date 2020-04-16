import axios from "axios";
import { message } from "antd";

export const baseURL = "/api";
export const loginUrl =
    "https://www.onlyid.net/oauth?client-id=xxx&redirect-uri=https%3A%2F%2Fwww.onlyid.net%2Fconsole%2Foauth-redirect";

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
        message.error(errMsg);

        return Promise.reject(err);
    }
);

export default instance;
