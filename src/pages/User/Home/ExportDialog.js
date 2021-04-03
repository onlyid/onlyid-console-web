import React, { PureComponent } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputAdornment,
    Link,
    MenuItem,
    Select
} from "@material-ui/core";
import DialogClose from "components/DialogClose";
import ClientSelect from "components/ClientSelect";
import styles from "./index.module.css";
import selectBar from "components/SelectBar.module.css";
import http from "my/http";

export default class extends PureComponent {
    state = {
        step: 1,
        clientId: "all",
        orderBy: "firstDate",
        fileUrl: "",
        loading: false
    };

    next = () => {
        this.setState({ step: 2 });
    };

    onClientChange = clientId => {
        this.setState({ clientId });
    };

    onOrderByChange = ({ target: { value } }) => {
        this.setState({ orderBy: value });
    };

    onSubmit = async () => {
        this.setState({ loading: true });

        const { clientId, orderBy } = this.state;

        const params = { orderBy };
        if (clientId !== "all") params.clientId = clientId;

        const { fileUrl } = await http.post("users/export", params);
        this.setState({ fileUrl, loading: false });
    };

    render() {
        const { open, onClose } = this.props;
        const { step, clientId, fileUrl, orderBy, loading } = this.state;

        if (step === 1)
            return (
                <Dialog open={open} onClose={onClose}>
                    <DialogTitle>
                        提示
                        <DialogClose onClose={onClose} />
                    </DialogTitle>
                    <DialogContent style={{ width: 600 }}>
                        <p style={{ marginTop: 0 }}>
                            如果你是准备迁出唯ID才全量导出用户，请再给我们一次机会。❤️
                        </p>
                        <p>
                            在使用唯ID产品上遇到任何问题、产品上有任何功能无法满足需求或者服务上有任何不满意的地方，都可以直接联系我们
                            <span style={{ color: "#4caf50" }}>（右上角问号图标）</span>
                            ，我们会以最好的服务态度竭诚解决你的任何问题，如果是产品功能方面的建议，我们团队内会认真考虑权衡，最后给出是否开发的决定以及具体上线的时间。
                        </p>
                        <p style={{ marginBottom: 0 }}>
                            如果你想直接和唯ID总负责人梁庭宾聊聊，请先联系客服，再要求直接对话总负责人，只要时间允许，总负责人非常乐意亲自解答你的任何问题。
                        </p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose}>取 消</Button>
                        <Button onClick={this.next} color="primary">
                            继续导出
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        else if (step === 2)
            return (
                <Dialog open={open} onClose={onClose}>
                    <DialogTitle>
                        全量导出
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
                        <p style={{ marginTop: 0 }}>选择要全量导出用户的应用，或者导出全部用户。</p>
                        <div className={selectBar.root} style={{ marginTop: 0 }}>
                            <ClientSelect value={clientId} onChange={this.onClientChange} />
                            <FormControl>
                                <Select
                                    name="order-by-select"
                                    value={orderBy}
                                    onChange={this.onOrderByChange}
                                    startAdornment={
                                        <InputAdornment position="start">排序</InputAdornment>
                                    }
                                >
                                    <MenuItem value="firstDate">最近新增</MenuItem>
                                    <MenuItem value="lastDate">最近活跃</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className="tipBox">
                            <p>提示：</p>
                            <ol>
                                <li>默认导出JSON格式文件，暂不可更改。</li>
                                <li>
                                    仅导出 "SSO 自然增长"
                                    类型的用户，不包括由你手工导入/新建以及已屏蔽黑名单用户。
                                </li>
                                <li style={{ color: "#ff9800" }}>
                                    导出数据不包含用户密码，请引导用户重新设置。
                                </li>
                                <li>
                                    JSON文件在某些浏览器默认点击在线预览，请使用右键 "另存为"
                                    触发文件下载。
                                </li>
                            </ol>
                        </div>
                    </DialogContent>
                    <DialogActions key="0">
                        <Button onClick={onClose}>{fileUrl ? "关 闭" : "取 消"}</Button>
                        <Button onClick={this.onSubmit} color="primary" disabled={loading}>
                            {loading ? "处理中..." : "确定导出"}
                        </Button>
                    </DialogActions>
                </Dialog>
            );
    }
}
