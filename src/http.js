import axios from "axios";
import { message } from "antd";

const DOMAIN = {
    development: "/",
    production: "https://console.onlyid.net/"
};

export const baseURL = DOMAIN[process.env.NODE_ENV] + "api";

const instance = axios.create({ baseURL });

instance.interceptors.response.use(
    res => res.data,
    err => {
        let errMsg;
        if (err.response) {
            errMsg = err.response.data.error;
        } else {
            errMsg = err.message;
        }
        message.error(errMsg);

        return Promise.reject(err);
    }
);

export default instance;
