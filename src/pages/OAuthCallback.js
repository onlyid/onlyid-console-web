import React, { PureComponent } from "react";
import { message, Spin } from "antd";
import { withRouter } from "react-router-dom";
import qs from "qs";
import http from "my/http";
import { eventEmitter } from "my/utils";

class OAuthCallback extends PureComponent {
    componentDidMount() {
        const {
            location: { search },
            history
        } = this.props;
        const query = qs.parse(search, { ignoreQueryPrefix: true });
        if (!query.code) {
            history.replace("/");
            return;
        }

        this.login(query.code);
    }

    login = async code => {
        const { history } = this.props;
        const { userInfo, tenantInfo } = await http.post("login", { code });
        localStorage.setObj("userInfo", userInfo);
        localStorage.setObj("tenantInfo", tenantInfo);
        eventEmitter.emit("app/login");

        if (new Date(tenantInfo.expireDate) < new Date()) {
            history.replace("/admin?show=renew");
            message.warn("服务已到期，请续费");
        } else {
            history.replace("/");
        }
    };

    render() {
        return (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
                <Spin size="large" />
            </div>
        );
    }
}

export default withRouter(OAuthCallback);
