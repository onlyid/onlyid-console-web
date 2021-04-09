import React, { PureComponent } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import DangerZone from "components/DangerZone";
import DialogClose from "components/DialogClose";
import http from "my/http";
import { withRouter } from "react-router-dom";
import { eventEmitter } from "my/utils";

class Danger extends PureComponent {
    state = {
        dialogOpen: false
    };

    toggleDialog = () => {
        this.setState(({ dialogOpen }) => ({ dialogOpen: !dialogOpen }));
    };

    onSubmit = async () => {
        const {
            match: { params },
            history
        } = this.props;

        await http.delete("roles/" + params.id);
        history.goBack();
        this.toggleDialog();
        eventEmitter.emit("app/openToast", { text: "删除成功", timeout: 2000 });
    };

    render() {
        const { dialogOpen } = this.state;

        return (
            <DangerZone>
                <li>
                    <div>
                        <h3>删除角色</h3>
                        <p>删除后，之前关联的用户立即失去该角色赋予的权限。</p>
                    </div>
                    <Button variant="contained" color="secondary" onClick={this.toggleDialog}>
                        删 除
                    </Button>
                </li>
                <Dialog open={dialogOpen} onClose={this.toggleDialog}>
                    <DialogTitle>
                        删除角色
                        <DialogClose onClose={this.toggleDialog} />
                    </DialogTitle>
                    <DialogContent>
                        <p style={{ margin: 0, minWidth: 400 }}>删除后不可恢复，确定删除？</p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.toggleDialog}>取 消</Button>
                        <Button onClick={this.onSubmit} color="secondary">
                            删 除
                        </Button>
                    </DialogActions>
                </Dialog>
            </DangerZone>
        );
    }
}

export default withRouter(Danger);
