import React, { PureComponent } from "react";
import { connect } from "react-redux";
import NoCard from "components/NoCard";
import Summary from "./Summary";
import UserActiveTable from "./UserActiveTable";
import UserActiveChart from "./UserActiveChart";
import OtpSentTable from "./OtpSentTable";
import OtpSentChart from "./OtpSentChart";
import CtrlMenu from "components/CtrlMenu";

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
            statistic: { selectedKey }
        } = this.props;
        if (prevProps.statistic.selectedKey !== selectedKey) this.back2info();
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
                right = <UserActiveTable isNew />;
                break;
            case "2":
                right = <UserActiveChart isNew />;
                break;
            case "3":
                right = <UserActiveTable />;
                break;
            case "4":
                right = <UserActiveChart />;
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
                    <CtrlMenu data={MENU_DATA} current={menuCurrent} onClick={this.onMenuClick} />
                </div>
                <div>
                    <NoCard title={MENU_DATA[menuCurrent].title}>{right}</NoCard>
                </div>
            </>
        );
    }
}

export default connect(({ statistic }) => ({ statistic }))(App);
