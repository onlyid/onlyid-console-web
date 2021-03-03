import React, { PureComponent } from "react";
import styles from "./index.module.css";
import Header from "./Header";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import { loginUrl } from "my/http";
import LeftDrawer from "./LeftDrawer";

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
            history.replace("/tenant/renewal");
        }
    }

    render() {
        const { children } = this.props;

        return (
            <div className={styles.layout}>
                <Header />
                <LeftDrawer />
                <main className={styles.main}>
                    <div className={styles.content}>{children}</div>
                </main>
            </div>
        );
    }
}

export default connect()(withRouter(Layout));
