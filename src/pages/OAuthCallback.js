import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import qs from "qs";
import http from "my/http";
import { eventEmitter } from "my/utils";
import moment from "moment";
import { CircularProgress } from "@material-ui/core";

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

        if (moment(tenantInfo.expireDate) < moment()) {
            history.replace("/tenant/renewal");
            eventEmitter.emit("app/openToast", { text: "服务已到期，请续费", severity: "warning" });
        } else {
            history.replace("/");
        }
    };

    render() {
        return (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
                <CircularProgress />
            </div>
        );
    }
}

export default withRouter(OAuthCallback);
