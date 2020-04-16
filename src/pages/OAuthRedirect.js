import React, { PureComponent } from "react";
import { Spin } from "antd";
import { withRouter } from "react-router-dom";
import qs from "qs";
import http from "my/http";
import { eventEmitter } from "my/utils";

class OAuthRedirect extends PureComponent {
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

        const { tenant, avatarUrl, nickname } = await http.post("login", { code });

        localStorage.tenant = tenant;
        localStorage.avatarUrl = avatarUrl;
        localStorage.nickname = nickname;
        eventEmitter.emit("app/login");

        history.replace("/");
    };

    render() {
        return (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
                <Spin size="large" />
            </div>
        );
    }
}

export default withRouter(OAuthRedirect);
