import React, { PureComponent } from "react";
import { message, Spin } from "antd";
import { withRouter } from "react-router-dom";
import qs from "qs";
import http from "my/http";
import { eventEmitter } from "my/utils";
import { connect } from "react-redux";
import moment from "moment";

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
        const { history, dispatch } = this.props;
        const { userInfo, tenantInfo } = await http.post("login", { code });
        localStorage.setObj("userInfo", userInfo);
        localStorage.setObj("tenantInfo", tenantInfo);
        eventEmitter.emit("app/login");

        if (moment(tenantInfo.expireDate) < moment()) {
            history.replace("/admin?show=renew");
            message.warn("服务已到期，请续费");
            dispatch({ type: "admin/save", payload: { tenantExpired: true } });
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

export default connect()(withRouter(OAuthCallback));
