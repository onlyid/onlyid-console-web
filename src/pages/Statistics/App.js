import React, { PureComponent } from "react";
import { Icon, Menu } from "antd";
import { connect } from "react-redux";
import Card from "components/Card";
import NoCard from "components/NoCard";
import Summary from "./Summary";
import UsersActiveTable from "./UsersActiveTable";
import UsersActiveChart from "./UsersActiveChart";
import OtpSentTable from "./OtpSentTable";
import OtpSentChart from "./OtpSentChart";

const { Item } = Menu;

const MENU_DATA = [
    { icon: "info-circle", title: "概览" },
    { icon: "table", title: "最近新增用户列表" },
    { icon: "line-chart", title: "最近新增用户折线图" },
    { icon: "table", title: "最近活跃用户列表" },
    { icon: "line-chart", title: "最近活跃用户折线图" },
    { icon: "table", title: "最近发送验证码列表" },
    { icon: "line-chart", title: "最近发送验证码折线图" }
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
                right = <Summary />;
                break;
            case "1":
                right = <UsersActiveTable isNew />;
                break;
            case "2":
                right = <UsersActiveChart isNew />;
                break;
            case "3":
                right = <UsersActiveTable />;
                break;
            case "4":
                right = <UsersActiveChart />;
                break;
            case "5":
                right = <OtpSentTable />;
                break;
            default:
                // 6
                right = <OtpSentChart />;
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
                <div>
                    <NoCard title={MENU_DATA[menuCurrent].title}>{right}</NoCard>
                </div>
            </>
        );
    }
}

export default connect(({ statistics }) => ({ statistics }))(App);
