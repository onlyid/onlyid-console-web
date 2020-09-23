import React, { PureComponent } from "react";
import { DATE_TIME_FORMAT, GENDER_TEXT } from "my/constants";
import { Descriptions } from "antd";
import Avatar from "components/Avatar";
import styles from "./index.module.css";
import http from "my/http";
import moment from "moment";
import SuccessStatus from "components/SuccessStatus";

const { Item } = Descriptions;

class AccountInfo extends PureComponent {
    state = {
        developerInfo: {}
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        this.setState({ developerInfo: await http.get("admin/developer-info") });
    };

    render() {
        const { developerInfo } = this.state;
        const userInfo = localStorage.getObj("userInfo");
        if (!userInfo) return null;

        return (
            <>
                <div className={styles.infoBox}>
                    <div>
                        <Avatar url={userInfo.avatarUrl} />
                    </div>
                    <Descriptions
                        column={3}
                        layout="vertical"
                        colon={false}
                        style={{ marginLeft: 50 }}
                    >
                        <Item label="开发者 ID" span={2}>
                            {userInfo.uid}
                        </Item>
                        <Item label="昵称">{userInfo.nickname}</Item>
                        <Item label="性别">
                            {userInfo.gender ? GENDER_TEXT[userInfo.gender] : "-"}
                        </Item>
                        <Item label="手机号">{userInfo.mobile || "-"}</Item>
                        <Item label="邮箱">{userInfo.email || "-"}</Item>
                    </Descriptions>
                </div>
                <p className="tip" style={{ marginTop: 20 }}>
                    编辑提示：和所有接入唯ID的应用一样，你应该使用「唯ID
                    APP」修改公共基础用户信息，此处不提供单独修改。
                </p>
                <hr className={styles.hr1} />
                <Descriptions column={4} layout="vertical" colon={false}>
                    <Item label="注册时间">
                        {developerInfo.registerDate
                            ? moment(developerInfo.registerDate).format(DATE_TIME_FORMAT)
                            : "-"}
                    </Item>
                    <Item label="上次登录时间">
                        {developerInfo.lastLoginDate
                            ? moment(developerInfo.lastLoginDate).format(DATE_TIME_FORMAT)
                            : "-"}
                    </Item>
                    <Item label="是否成功">
                        <SuccessStatus success={developerInfo.lastLoginSuccess} />
                    </Item>
                </Descriptions>
            </>
        );
    }
}

export default AccountInfo;
