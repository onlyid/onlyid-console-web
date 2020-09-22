import React, { PureComponent } from "react";
import styles from "./index.module.css";
import Header from "./Header";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import { loginUrl } from "my/http";

class Layout extends PureComponent {
    componentDidMount() {
        const { history, dispatch, location } = this.props;

        const tenantInfo = localStorage.getObj("tenantInfo");
        const userInfo = localStorage.getObj("userInfo");
        if ((!tenantInfo || !userInfo) && location.pathname !== "/oauth-callback") {
            window.location.replace(loginUrl);
            return;
        }

        if (location.pathname === "/oauth-callback" || location.pathname === "/alipay-callback")
            return;

        if (moment(tenantInfo.expireDate) < moment()) {
            dispatch({ type: "admin/save", payload: { tenantExpired: true } });
            history.replace("/admin?show=renew");
        }
    }

    render() {
        const { children } = this.props;

        return (
            <div className={styles.layout}>
                <Header />
                <div className={styles.content}>{children}</div>
                <div className={styles.footer}>
                    &copy; 2015 - {new Date().getFullYear()}
                    <span style={{ marginLeft: 20, marginRight: 20 }}>深圳市友全科技有限公司</span>
                    All rights reserved.
                </div>
            </div>
        );
    }
}

export default connect()(withRouter(Layout));
