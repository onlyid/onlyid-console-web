import React, { PureComponent } from "react";
import styles from "./index.module.css";
import Header from "./Header";
import { withRouter } from "react-router-dom";
import moment from "moment";
import { loginUrl } from "my/http";
import LeftDrawer from "./LeftDrawer";
import { Alert } from "@material-ui/lab";
import { Snackbar } from "@material-ui/core";
import { eventEmitter } from "my/utils";

class Layout extends PureComponent {
    state = {
        toast: { open: false, text: "", severity: "", timeout: 0 },
    };

    componentDidMount() {
        const { history, location } = this.props;

        eventEmitter.on("app/openToast", this.openToast);

        const tenantInfo = localStorage.getObj("tenantInfo");
        const userInfo = localStorage.getObj("userInfo");
        if ((!tenantInfo || !userInfo) && location.pathname !== "/oauth-callback") {
            window.location.replace(loginUrl);
            return;
        }

        if (location.pathname === "/oauth-callback" || location.pathname === "/alipay-callback")
            return;

        if (moment(tenantInfo.expireDate) < moment()) {
            history.replace("/tenant/renewal");
        }
    }

    componentWillUnmount() {
        eventEmitter.off("app/openToast", this.openToast);
    }

    openToast = async (toast) => {
        const {
            toast: { open },
        } = this.state;
        if (open) await this.closeToast();

        this.setState({ toast: { open: true, severity: "success", timeout: 4000, ...toast } });
    };

    closeToast = () => {
        this.setState(({ toast }) => ({ toast: { ...toast, open: false } }));
    };

    render() {
        const { children } = this.props;
        const { toast } = this.state;

        return (
            <div className={styles.layout}>
                <Header />
                <LeftDrawer />
                <main className={styles.main}>
                    <div className={styles.content}>{children}</div>
                </main>
                <Snackbar
                    open={toast.open}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    onClose={this.closeToast}
                    autoHideDuration={toast.timeout}
                    ClickAwayListenerProps={{ mouseEvent: false }}
                >
                    <Alert elevation={1} severity={toast.severity}>
                        {toast.text}
                    </Alert>
                </Snackbar>
            </div>
        );
    }
}

export default withRouter(Layout);
