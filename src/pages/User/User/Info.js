import React from "react"
import InfoBox from "components/InfoBox"
import GenderSymbol from "components/GenderSymbol"
import { Paper } from "@material-ui/core"
import tipBox from "components/TipBox.module.css"

export default function Info({ user }) {
    return (
        <>
            <Paper variant="outlined" style={{ marginTop: 40 }}>
                <InfoBox label="昵称">{user.nickname}</InfoBox>
                <InfoBox label="手机号">{user.mobile || "-"}</InfoBox>
                <InfoBox label="邮箱">{user.email || "-"}</InfoBox>
                <InfoBox label="性别">
                    <GenderSymbol gender={user.gender} />
                </InfoBox>
                <InfoBox label="年纪">
                    {user.birthDate ? user.birthDate.substring(2, 4) + "后" : "-"}
                </InfoBox>
                <InfoBox label="地区">
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
    )
}
