import React, { PureComponent } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import DangerZone from "components/DangerZone";
import DialogClose from "components/DialogClose";
import http from "my/http";
import { withRouter } from "react-router-dom";
import { eventEmitter } from "my/utils";

class Danger extends PureComponent {
    state = {
        dialogOpen: false,
        operation: ""
    };

    confirm = operation => {
        this.setState({ dialogOpen: true, operation });
    };

    closeDialog = () => {
        this.setState({ dialogOpen: false });
    };

    onSubmit = async () => {
        const {
            match: {
                params: { clientId }
            },
            history,
            onSave
        } = this.props;
        const { operation } = this.state;

        let toastText;
        if (operation === "delete") {
            await http.delete("clients/" + clientId);
            toastText = "删除成功";
            history.goBack();
        } else {
            await http.put(`clients/${clientId}/secret`);
            toastText = "重置成功";
            onSave();
        }
        this.closeDialog();
        eventEmitter.emit("app/openToast", { text: toastText, timeout: 2000 });
    };

    render() {
        const { dialogOpen, operation } = this.state;

        let dialogTitle, dialogContent, dialogButtonText;
        if (operation === "delete") {
            dialogTitle = "删除应用";
            dialogContent = "删除后不可恢复，确定删除？";
            dialogButtonText = "删 除";
        } else {
            dialogTitle = "重置 Secret";
            dialogContent = "重置后不可还原，确定重置？";
            dialogButtonText = "重 置";
        }

        return (
            <DangerZone>
                <li>
                    <div>
                        <h3>删除应用</h3>
                        <p>删除后，和该应用相关的所有认证产品都将停止工作。</p>
                    </div>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => this.confirm("delete")}
                    >
                        删 除
                    </Button>
                </li>
                <li>
                    <div>
                        <h3>重置 Secret</h3>
                        <p>一般仅在原secret泄漏时需要重置，重置后原secret马上失效。</p>
                    </div>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => this.confirm("rotate")}
                    >
                        重 置
                    </Button>
                </li>
                <Dialog open={dialogOpen} onClose={this.closeDialog}>
                    <DialogTitle>
                        {dialogTitle}
                        <DialogClose onClose={this.closeDialog} />
                    </DialogTitle>
                    <DialogContent>
                        <p style={{ margin: 0, minWidth: 400 }}>{dialogContent}</p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeDialog}>取 消</Button>
                        <Button onClick={this.onSubmit} color="secondary">
                            {dialogButtonText}
                        </Button>
                    </DialogActions>
                </Dialog>
            </DangerZone>
        );
    }
}

export default withRouter(Danger);
