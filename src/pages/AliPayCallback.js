import React, { PureComponent } from "react";
import { message, Spin } from "antd";
import { withRouter } from "react-router-dom";
import qs from "qs";
import http from "my/http";

class AliPayCallback extends PureComponent {
    componentDidMount() {
        const {
            location: { search },
            history
        } = this.props;
        const query = qs.parse(search, { ignoreQueryPrefix: true });
        if (!query["out_trade_no"]) {
            history.replace("/");
            return;
        }

        this.checkRenew(query["out_trade_no"]);
    }

    checkRenew = async tradeId => {
        const { history } = this.props;
        const tenantInfo = await http.post("admin/check-renew", { tradeId });
        localStorage.setObj("tenantInfo", tenantInfo);
        history.replace("/admin?show=renew");
        message.success("续费成功");
    };

    render() {
        return (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
                <Spin size="large" />
            </div>
        );
    }
}

export default withRouter(AliPayCallback);
