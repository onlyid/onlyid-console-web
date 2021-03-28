import React, { PureComponent } from "react";
import http from "my/http";
import { Button } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { eventEmitter } from "my/utils";

class Json extends PureComponent {
    state = {
        user: {}
    };

    componentDidMount() {
        this.initData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { user } = this.state;

        if (user !== prevState.user) window.Prism.highlightAll();
    }

    initData = async () => {
        const { match } = this.props;
        const user = await http.get(`users/${match.params.id}/with-extra`);
        this.setState({ user });
    };

    copy = () => {
        const { user } = this.state;

        const el = document.createElement("textarea");
        el.value = JSON.stringify(user, null, 4);
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);

        eventEmitter.emit("app/openToast", { text: "复制成功", timeout: 2000 });
    };

    render() {
        const { user } = this.state;

        const formatted = JSON.stringify(user, null, 4);

        return (
            <>
                <pre style={{ margin: "40px 0 0" }}>
                    <code className="language-javascript">{formatted}</code>
                </pre>
                <Button
                    color="primary"
                    onClick={this.copy}
                    style={{ marginTop: 16 }}
                    className="small"
                    startIcon={
                        <span className="material-icons" style={{ fontSize: 18 }}>
                            content_copy
                        </span>
                    }
                >
                    复制
                </Button>
                <div className="tipBox">
                    <p>提示：</p>
                    <ol>
                        <li>
                            本页展示你的应用使用Open
                            API获取到的用户信息，其中extra字段是用户附加信息。
                        </li>
                        <li>
                            当需要唯一标识用户时，应使用id字段。用户ID跨租户统一：同一个用户的id在你的应用和在其他开发者的应用是一样的。
                        </li>
                    </ol>
                </div>
            </>
        );
    }
}

export default withRouter(Json);
