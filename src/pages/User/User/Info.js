import React from "react";
import { DATE_FORMAT } from "my/constants";
import moment from "moment";
import InfoBox from "components/InfoBox";
import GenderSymbol from "components/GenderSymbol";
import { Paper } from "@material-ui/core";
import tipBox from "components/TipBox.module.css";

export default function Info({ user }) {
    return (
        <>
            <Paper variant="outlined" style={{ marginTop: 40 }}>
                <InfoBox label="用户昵称">{user.nickname}</InfoBox>
                <InfoBox label="用户手机号">{user.mobile || "-"}</InfoBox>
                <InfoBox label="用户邮箱">{user.email || "-"}</InfoBox>
                <InfoBox label="用户性别">
                    <GenderSymbol gender={user.gender} />
                </InfoBox>
                <InfoBox label="用户出生日期">
                    {user.birthDate ? moment(user.birthDate).format(DATE_FORMAT) : "-"}
                </InfoBox>
                <InfoBox label="用户地区">
                    {user.province ? user.province + " - " + user.city : "-"}
                </InfoBox>
            </Paper>
            <div className={tipBox.root}>
                <p>提示：</p>
                <ol>
                    <li>用户的账号信息属于用户所有，你不能修改。</li>
                </ol>
            </div>
        </>
    );
}
