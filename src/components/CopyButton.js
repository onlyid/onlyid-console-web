import React, { PureComponent } from "react";
import { Snackbar, Tooltip } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

export default class extends PureComponent {
    state = {
        toastOpen: false
    };

    onClose = () => {
        this.setState({ toastOpen: false });
    };

    copy = () => {
        const { value } = this.props;

        const el = document.createElement("textarea");
        el.value = value;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);

        this.setState({ toastOpen: true });
    };

    render() {
        const { toastOpen } = this.state;

        return (
            <>
                <Tooltip title="复制">
                    <div className="inputEndButton" onClick={this.copy}>
                        <span className="material-icons">content_copy</span>
                    </div>
                </Tooltip>
                <Snackbar
                    open={toastOpen}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    onClose={this.onClose}
                    autoHideDuration={2000}
                    ClickAwayListenerProps={{ mouseEvent: false }}
                >
                    <Alert elevation={1} severity="success">
                        复制成功
                    </Alert>
                </Snackbar>
            </>
        );
    }
}
