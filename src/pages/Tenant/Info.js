import React, { PureComponent } from "react";
import { DATE_FORMAT, DATE_TIME_FORMAT } from "my/constants";
import Avatar from "components/Avatar";
import styles from "./index.module.css";
import http from "my/http";
import moment from "moment";
import SuccessStatus from "components/SuccessStatus";
import GenderSymbol from "components/GenderSymbol";
import InfoBox from "components/InfoBox";
import tipBox from "components/TipBox.module.css";

class Info extends PureComponent {
    state = {
        lastLogin: {}
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const lastLogin = await http.get("tenant/last-login");
        this.setState({ lastLogin });
    };

    render() {
        const { lastLogin } = this.state;
        const userInfo = localStorage.getObj("userInfo");
        const tenantInfo = localStorage.getObj("tenantInfo");
        if (!userInfo) return null;

        return (
            <>
                <div className={styles.infoBox}>
                    <InfoBox label="头像">
                        <Avatar url={userInfo.avatarUrl} />
                    </InfoBox>
                    <InfoBox label="昵称">{userInfo.nickname}</InfoBox>
                    <InfoBox label="手机号">{userInfo.mobile || "-"}</InfoBox>
                    <InfoBox label="邮箱">{userInfo.email || "-"}</InfoBox>
                    <InfoBox label="性别">
                        <GenderSymbol gender={userInfo.gender} />
                    </InfoBox>
                    <InfoBox label="出生日期">
                        {userInfo.birthDate ? moment(userInfo.birthDate).format(DATE_FORMAT) : "-"}
                    </InfoBox>
                    <InfoBox label="地区">
                        {userInfo.province ? userInfo.province + " - " + userInfo.city : "-"}
                    </InfoBox>
                    <InfoBox label="简介">{userInfo.bio || "-"}</InfoBox>
                </div>
                <hr className={styles.hr1} />
                <div className={styles.infoBox}>
                    <InfoBox label="注册时间">
                        {moment(tenantInfo.createDate).format(DATE_TIME_FORMAT)}
                    </InfoBox>
                    <InfoBox label="上次登录时间">
                        {moment(lastLogin.date).format(DATE_TIME_FORMAT)}
                    </InfoBox>
                    <InfoBox label="上次登录状态">
                        <SuccessStatus success={lastLogin.success} />
                    </InfoBox>
                </div>
                <div className={tipBox.root}>
                    <p>提示：和所有接入唯ID SSO的应用一样，请使用唯ID APP修改本页用户信息。</p>
                </div>
            </>
        );
    }
}

export default Info;
