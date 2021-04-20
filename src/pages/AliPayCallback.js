import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import qs from "qs";
import http from "my/http";
import { eventEmitter } from "../my/utils";
import { CircularProgress } from "@material-ui/core";

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

    checkRenew = async chargeId => {
        const { history } = this.props;

        try {
            const tenantInfo = await http.post("tenant/check-renew", { chargeId });
            localStorage.setObj("tenantInfo", tenantInfo);
            eventEmitter.emit("app/openToast", { text: "续费成功", timeout: 2000 });
        } finally {
            history.replace("/tenant/renewal");
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

export default withRouter(AliPayCallback);
