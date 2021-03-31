import React, { PureComponent } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputAdornment,
    MenuItem,
    Select
} from "@material-ui/core";
import DangerZone from "components/DangerZone";
import DialogClose from "components/DialogClose";
import http from "my/http";
import { withRouter } from "react-router-dom";
import { eventEmitter } from "my/utils";
import DateCountDown from "components/DateCountDown";
import styles from "./index.module.css";

function RemoveDialog({ open, activated, onCancel, onRemove }) {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>
                确认移除？
                <DialogClose onClose={onCancel} />
            </DialogTitle>
            <DialogContent>
                <p style={{ margin: 0, width: 400 }}>
                    {activated
                        ? "移除不会删除用户账号，后续TA仍可以登录你（或其他开发者）的应用。如果想拒绝用户登录，应将其屏蔽加入黑名单。"
                        : "该用户未激活，移除会删除用户账号，数据不可恢复。"}
                </p>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>取 消</Button>
                <Button onClick={onRemove} color="secondary">
                    移 除
                </Button>
            </DialogActions>
        </Dialog>
    );
}

class BlockDialog extends PureComponent {
    state = {
        days: 0
    };

    onChange = ({ target: { value } }) => {
        this.setState({ days: value });
    };

    render() {
        const { open, blocked, onCancel, onSubmit } = this.props;
        const { days } = this.state;

        return (
            <Dialog open={open} onClose={onCancel}>
                <DialogTitle>
                    {blocked ? "确认解除？" : "确认屏蔽？"}
                    <DialogClose onClose={onCancel} />
                </DialogTitle>
                <DialogContent className={styles.blockDialog}>
                    {blocked ? (
                        <p>解除屏蔽后，该用户就可以继续登录你名下的所有应用。</p>
                    ) : (
                        <>
                            <p>屏蔽后，该用户将不能登录你名下的所有应用。</p>
                            <FormControl style={{ marginTop: "1em" }}>
                                <Select
                                    id="days-select"
                                    value={days}
                                    onChange={this.onChange}
                                    startAdornment={
                                        <InputAdornment position="start">屏蔽时间</InputAdornment>
                                    }
                                >
                                    <MenuItem value="0">永久屏蔽</MenuItem>
                                    <MenuItem value="1">1天后解除</MenuItem>
                                    <MenuItem value="7">7天后解除</MenuItem>
                                    <MenuItem value="30">30天后解除</MenuItem>
                                    <MenuItem value="90">90天后解除</MenuItem>
                                </Select>
                            </FormControl>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancel}>取 消</Button>
                    <Button onClick={() => onSubmit(days)} color="secondary">
                        {blocked ? "解除屏蔽" : "屏 蔽"}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

class Danger extends PureComponent {
    state = {
        removeOpen: false,
        blockOpen: false,
        blocked: false,
        expireDate: null
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const { match } = this.props;
        const { blocked, expireDate } = await http.get(`users/${match.params.id}/check-blocked`);
        this.setState({ blocked, expireDate });
    };

    toggleRemove = () => {
        this.setState(({ removeOpen }) => ({ removeOpen: !removeOpen }));
    };

    toggleBlock = () => {
        this.setState(({ blockOpen }) => ({ blockOpen: !blockOpen }));
    };

    onRemove = async () => {
        const { match, history } = this.props;

        await http.delete(`users/${match.params.id}`);
        eventEmitter.emit("app/openToast", { text: "移除成功", timeout: 2000 });
        history.goBack();
    };

    onSubmit = async days => {
        const { match } = this.props;
        const { blocked } = this.state;

        let toastText;
        if (blocked) {
            await http.post(`users/${match.params.id}/unblock`);
            toastText = "解除屏蔽成功";
        } else {
            await http.post(`users/${match.params.id}/block`, { days });
            toastText = "屏蔽成功";
        }

        this.initData();
        this.toggleBlock();
        eventEmitter.emit("app/openToast", { text: toastText, timeout: 2000 });
    };

    render() {
        const { activated } = this.props;
        const { removeOpen, blockOpen, blocked, expireDate } = this.state;

        return (
            <DangerZone>
                <li>
                    <div>
                        <h3>移除用户</h3>
                        <p>
                            将用户从用户池移除，但不删除用户账号（除非该用户由你导入/新建且未激活）。
                        </p>
                    </div>
                    <Button variant="contained" color="secondary" onClick={this.toggleRemove}>
                        移 除
                    </Button>
                </li>
                <li>
                    <div>
                        <h3>
                            {blocked ? (
                                <>
                                    解除屏蔽
                                    {expireDate && (
                                        <span className={styles.blockCountDown}>
                                            （<DateCountDown date={expireDate} />）
                                        </span>
                                    )}
                                </>
                            ) : (
                                "屏蔽用户"
                            )}
                        </h3>
                        <p>
                            {blocked
                                ? `解除对该用户的屏蔽，允许其继续登录你名下的所有应用。`
                                : "将恶意用户加入黑名单，屏蔽TA登录你名下的所有应用，可设置定时解除屏蔽。"}
                        </p>
                    </div>
                    <Button variant="contained" color="secondary" onClick={this.toggleBlock}>
                        {blocked ? "解除屏蔽" : "屏 蔽"}
                    </Button>
                </li>
                <RemoveDialog
                    open={removeOpen}
                    activated={activated}
                    onCancel={this.toggleRemove}
                    onRemove={this.onRemove}
                />
                <BlockDialog
                    open={blockOpen}
                    blocked={blocked}
                    onCancel={this.toggleBlock}
                    onSubmit={this.onSubmit}
                />
            </DangerZone>
        );
    }
}

export default withRouter(Danger);
