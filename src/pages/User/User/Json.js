import React, { PureComponent } from "react";
import http from "my/http";
import { Button } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { eventEmitter } from "my/utils";
import tipBox from "components/TipBox.module.css";

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
        const user = await http.get(`users/${match.params.id}`);
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
                <div className={tipBox.root}>
                    <p>提示：</p>
                    <ol>
                        <li>本页展示你的应用使用UserInfo API获取到的用户信息。</li>
                    </ol>
                </div>
            </>
        );
    }
}

export default withRouter(Json);
