import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Card from "components/Card";
import DeveloperInfo from "./DeveloperInfo";
import NotificationSetting from "./NotificationSetting";
import RenewTenant from "./RenewTenant";
import styles from "./index.module.css";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import CtrlMenu from "components/CtrlMenu";

const MENU_DATA = [
    { icon: "user", title: "开发者信息", key: "developer" },
    { icon: "transaction", title: "有效期和续费", key: "renewal" },
    { icon: "bell", title: "通知设置", key: "notification" }
];

class Admin extends PureComponent {
    state = {
        menuCurrent: null
    };

    componentDidMount() {
        this.updateMenuCurrent();
    }

    componentDidUpdate(prevProps) {
        const { pathname } = this.props.location;
        if (prevProps.location.pathname === pathname) return;

        this.updateMenuCurrent();
    }

    updateMenuCurrent = () => {
        const { pathname } = this.props.location;
        const p = pathname.split("/")[2];
        this.setState({ menuCurrent: p });
    };

    onMenuClick = ({ key }) => {
        const { history, match } = this.props;

        history.push(`${match.url}/${key}`);
    };

    render() {
        const { menuCurrent } = this.state;
        const { match } = this.props;

        const item = MENU_DATA.find(item => item.key === menuCurrent);

        return (
            <div className={styles.root}>
                <div>
                    <CtrlMenu data={MENU_DATA} current={menuCurrent} onClick={this.onMenuClick} />
                </div>
                <div>
                    <Card style={{ width: 925 }} title={item && item.title}>
                        <Switch>
                            <Route path={`${match.path}/developer`}>
                                <DeveloperInfo />
                            </Route>
                            <Route path={`${match.path}/renewal`}>
                                <RenewTenant />
                            </Route>
                            <Route path={`${match.path}/notification`}>
                                <NotificationSetting />
                            </Route>
                            <Route path="/">
                                <Redirect to={`${match.url}/developer`} />
                            </Route>
                        </Switch>
                    </Card>
                </div>
            </div>
        );
    }
}

export default connect(({ admin }) => ({ admin }))(withRouter(Admin));
