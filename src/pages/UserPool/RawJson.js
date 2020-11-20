import React, { PureComponent } from "react";
import { connect } from "react-redux";
import http from "my/http";
import { Button, message } from "antd";

class RawJson extends PureComponent {
    state = {
        info: {}
    };

    componentDidMount() {
        this.initData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { info } = this.state;

        if (info !== prevState.info) window.Prism.highlightAll();
    }

    initData = async () => {
        const { userPool } = this.props;
        const info = await http.get(`users/${userPool.selectedKey}/with-extra`);
        this.setState({ info });
    };

    copy = () => {
        const { info } = this.state;

        const el = document.createElement("textarea");
        el.value = JSON.stringify(info, null, 2);
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        message.success("复制成功");
    };

    render() {
        const { info } = this.state;

        const formatted = JSON.stringify(info, null, 2);

        return (
            <>
                <pre style={{ margin: 0 }}>
                    <code className="language-javascript">{formatted}</code>
                </pre>
                <Button
                    onClick={this.copy}
                    style={{ marginTop: 16, marginBottom: 24 }}
                    type="link"
                    icon="copy"
                >
                    复制
                </Button>
                <ul className="tip ulTip">
                    <li>
                        1）此处展示你的应用使用Open
                        API获取到的用户信息，其中extra字段是用户附加信息。
                    </li>
                    <li>
                        2）当需要唯一标识用户时，应使用uid字段。用户uid跨租户统一：同一个用户的uid在你的应用和在其他开发者的应用是一样的。
                    </li>
                </ul>
            </>
        );
    }
}

export default connect(({ userPool }) => ({ userPool }))(RawJson);
