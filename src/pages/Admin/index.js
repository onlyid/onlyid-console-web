import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Card from "components/Card";
import AccountInfo from "./AccountInfo";
import NotificationManage from "./NotificationManage";
import Renew from "./Renew";
import styles from "./index.module.css";
import { withRouter } from "react-router-dom";
import qs from "qs";
import CtrlMenu from "components/CtrlMenu";

const MENU_DATA = [
    { icon: "user", title: "开发者信息" },
    { icon: "transaction", title: "有效期和续费" },
    { icon: "bell", title: "通知管理" }
];

class Admin extends PureComponent {
    state = {
        menuCurrent: "0"
    };

    componentDidMount() {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search, { ignoreQueryPrefix: true });
        if (query.show === "renew") this.setState({ menuCurrent: "1" });
    }

    onMenuClick = ({ key }) => {
        this.setState({ menuCurrent: key });
    };

    render() {
        const { menuCurrent } = this.state;

        let right;
        switch (menuCurrent) {
            case "0":
                right = <AccountInfo />;
                break;
            case "1":
                right = <Renew />;
                break;
            default:
                // 2
                right = <NotificationManage />;
        }

        return (
            <div className={styles.root}>
                <div>
                    <CtrlMenu data={MENU_DATA} current={menuCurrent} onClick={this.onMenuClick} />
                </div>
                <div>
                    <Card style={{ width: 925 }} title={MENU_DATA[menuCurrent].title}>
                        {right}
                    </Card>
                </div>
            </div>
        );
    }
}

export default connect(({ admin }) => ({ admin }))(withRouter(Admin));
