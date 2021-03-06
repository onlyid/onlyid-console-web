import React from "react";
import { DATE_FORMAT, DATE_TIME_FORMAT } from "my/constants";
import moment from "moment";
import InfoBox from "components/InfoBox";
import GenderSymbol from "components/GenderSymbol";
import { Paper } from "@material-ui/core";
import tipBox from "components/TipBox.module.css";

export default function({ user }) {
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
                <InfoBox label="用户简介">{user.bio || "-"}</InfoBox>
                <InfoBox label="账号创建时间">
                    {moment(user.createDate).format(DATE_TIME_FORMAT)}
                </InfoBox>
            </Paper>
            <div className={tipBox.root}>
                <p>提示：</p>
                <ol>
                    <li>该用户不是你创建的或者已经激活，你不能编辑。</li>
                </ol>
            </div>
        </>
    );
}
