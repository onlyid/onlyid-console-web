import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Link } from "@material-ui/core";
import DialogClose from "components/DialogClose";
import React, { PureComponent } from "react";
import http from "my/http";
import styles from "./ExportDialog.module.css";
import tipBox from "components/TipBox.module.css";

export default class extends PureComponent {
    state = {
        list: [],
        fileUrl: "",
        loading: false
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const list = await http.get("clients");
        this.setState({ list });
    };

    onSubmit = async () => {
        this.setState({ loading: true });

        const { clientId, days, sendSuccess, verifySuccess, keyword } = this.props;

        const params = { keyword, days };
        if (clientId !== "all") params.clientId = clientId;
        if (sendSuccess !== "all") params.sendSuccess = sendSuccess;
        if (verifySuccess !== "all") params.verifySuccess = verifySuccess;

        const { fileUrl } = await http.post("otp/export", params);
        this.setState({ fileUrl, loading: false });
    };

    getStatusText = success => {
        switch (success) {
            case "all":
                return "查看全部";
            case "true":
                return "只看成功";
            default:
                return "只看失败";
        }
    };

    render() {
        const { open, onClose, clientId, days, sendSuccess, verifySuccess, keyword } = this.props;
        const { list, fileUrl, loading } = this.state;

        const clientName =
            clientId === "all" ? "全部应用" : `${list.find(item => item.id === clientId).name}`;

        return (
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>
                    导出数据
                    <DialogClose onClose={onClose} />
                </DialogTitle>
                <DialogContent style={{ width: 600 }}>
                    {fileUrl && (
                        <div className={styles.downloadBox}>
                            <p>
                                <span style={{ color: "#4caf50" }}>导出成功</span>，下载地址：
                            </p>
                            <Link href={fileUrl} target="_blank">
                                {fileUrl}
                            </Link>
                        </div>
                    )}
                    <p style={{ marginTop: 0 }}>筛选条件：</p>
                    <ul className={styles.ul1}>
                        <li>
                            <span>应用：</span>
                            {clientName}
                        </li>
                        <li>
                            <span>时间：</span>
                            最近{days}天
                        </li>
                        <li>
                            <span>发送状态：</span>
                            {this.getStatusText(sendSuccess)}
                        </li>
                    </ul>
                    <ul className={styles.ul1}>
                        <li>
                            <span>校验状态：</span>
                            {this.getStatusText(verifySuccess)}
                        </li>
                        <li>
                            <span>手机号：</span>
                            {keyword || "-"}
                        </li>
                    </ul>
                    <div className={tipBox.root}>
                        <p>提示：</p>
                        <ol>
                            <li>默认导出JSON格式文件，暂不可更改。</li>
                            <li style={{ color: "#ff9800" }}>
                                仅限导出最近三个月的记录，如需要，请及时导出对应月份数据。
                            </li>
                            <li>
                                JSON文件在某些浏览器默认点击在线预览，请使用右键 "另存为"
                                触发文件下载。
                            </li>
                        </ol>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>{fileUrl ? "关 闭" : "取 消"}</Button>
                    <Button onClick={this.onSubmit} color="primary" disabled={loading}>
                        {loading ? "处理中..." : "确定导出"}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}
