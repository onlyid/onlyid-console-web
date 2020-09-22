import React, { PureComponent } from "react";
import { message, Spin } from "antd";
import { withRouter } from "react-router-dom";
import qs from "qs";
import http from "my/http";
import { connect } from "react-redux";
import moment from "moment";

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
        const { history, dispatch } = this.props;

        try {
            const tenantInfo = await http.post("admin/check-renew", { tradeId });
            localStorage.setObj("tenantInfo", tenantInfo);
            message.success("续费成功");
        } catch (e) {
            const tenantInfo = localStorage.getObj("tenantInfo");
            if (moment(tenantInfo.expireDate) < moment())
                dispatch({ type: "admin/save", payload: { tenantExpired: true } });
            throw e;
        } finally {
            history.replace("/admin?show=renew");
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

export default connect()(withRouter(AliPayCallback));
