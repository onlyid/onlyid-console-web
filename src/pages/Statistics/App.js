import React, { PureComponent } from "react";
import { Icon, Menu } from "antd";
import { connect } from "react-redux";
import Card from "components/Card";
import Summary from "./Summary";
import UsersActive from "./UsersActive";
import OtpSent from "./OtpSent";

const { Item } = Menu;

const MENU_DATA = [
    { icon: "info-circle", title: "概览" },
    { icon: "line-chart", title: "最近新增用户" },
    { icon: "line-chart", title: "最近活跃用户" },
    { icon: "line-chart", title: "最近发送验证码" }
];

class App extends PureComponent {
    state = {
        menuCurrent: "0"
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {
            statistics: { selectedKey }
        } = this.props;
        if (prevProps.statistics.selectedKey !== selectedKey) this.back2info();
    }

    onMenuClick = ({ key }) => {
        this.setState({ menuCurrent: key });
    };

    back2info = () => {
        this.setState({ menuCurrent: "0" });
    };

    render() {
        const { menuCurrent } = this.state;

        let right;
        switch (menuCurrent) {
            case "0":
                right = (
                    <Card title={MENU_DATA[menuCurrent].title}>
                        <Summary />
                    </Card>
                );
                break;
            case "1":
                right = <UsersActive isNew />;
                break;
            case "2":
                right = <UsersActive />;
                break;
            default:
                // 3
                right = <OtpSent />;
        }

        return (
            <>
                <div>
                    <Menu
                        onClick={this.onMenuClick}
                        selectedKeys={[menuCurrent]}
                        className="ctrlMenu"
                    >
                        {MENU_DATA.map((item, index) => (
                            <Item key={item.key || String(index)}>
                                <Icon type={item.icon} />
                                {item.title}
                            </Item>
                        ))}
                    </Menu>
                </div>
                <div>{right}</div>
            </>
        );
    }
}

export default connect(({ statistics }) => ({ statistics }))(App);
