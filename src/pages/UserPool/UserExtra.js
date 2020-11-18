import React, { PureComponent } from "react";
import http from "my/http";
import { connect } from "react-redux";
import { Button, Form, Input, message } from "antd";

const { Item } = Form;
const { TextArea } = Input;

class Edit1 extends PureComponent {
    checkJson = (rule, value, callback) => {
        // 为空认为是合法值
        if (!value) {
            callback();
            return;
        }

        if (!value.startsWith("{")) {
            callback("必须是JSON格式");
            return;
        }

        try {
            JSON.parse(value);
            callback();
        } catch (err) {
            callback("必须是JSON格式");
        }
    };

    submit = () => {
        const { form, onSave, userPool } = this.props;

        form.validateFields(async (err, values) => {
            if (err) return;

            await http.put(`users/${userPool.selectedKey}/extra`, values);

            onSave();
            message.success("保存成功");
        });
    };

    render() {
        const { form, extra, onCancel } = this.props;
        const { getFieldDecorator } = form;

        return (
            <Form layout="vertical">
                <Item>
                    {getFieldDecorator("extra", {
                        initialValue: extra,
                        rules: [
                            { max: 5000, message: "最多输入5000字" },
                            { validator: this.checkJson }
                        ]
                    })(
                        <TextArea
                            rows={4}
                            placeholder={`{"themePreference": "dark", "blogUrl": "www.example.com", ...}`}
                        />
                    )}
                </Item>
                <Item>
                    <Button type="primary" onClick={this.submit}>
                        保存
                    </Button>
                    <Button onClick={onCancel} style={{ marginLeft: 20 }}>
                        取消
                    </Button>
                </Item>
            </Form>
        );
    }
}

const Edit = Form.create()(connect(({ userPool }) => ({ userPool }))(Edit1));

class UserExtra extends PureComponent {
    state = {
        userExtra: null,
        isEdit: false
    };

    componentDidMount() {
        this.initData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { userExtra, isEdit } = this.state;

        if (isEdit) return;

        if (userExtra !== prevState.userExtra || isEdit !== prevState.isEdit)
            window.Prism.highlightAll();
    }

    initData = async () => {
        const { userPool } = this.props;
        const userExtra = await http.get(`users/${userPool.selectedKey}/extra`);
        this.setState({ userExtra });
    };

    showEdit = () => {
        this.setState({ isEdit: true });
    };

    onSave = () => {
        this.setState({ isEdit: false });
        this.initData();
    };

    onCancel = () => {
        this.setState({ isEdit: false });
    };

    render() {
        const { userExtra, isEdit } = this.state;

        const extra = userExtra && userExtra.extra;
        const formatted = extra ? JSON.stringify(JSON.parse(extra), null, 2) : "-";

        return (
            <>
                {isEdit ? (
                    <Edit extra={extra} onSave={this.onSave} onCancel={this.onCancel} />
                ) : (
                    <>
                        <pre style={{ margin: 0, minHeight: 100 }}>
                            <code className="language-javascript">{formatted}</code>
                        </pre>
                        <Button onClick={this.showEdit} style={{ marginTop: 32, marginBottom: 32 }}>
                            编辑
                        </Button>
                    </>
                )}
                <ul className="tip ulTip">
                    <li>
                        1）用户附加信息是对用户账号信息的个性化补充。两者区别：账号信息跨租户共享，你不能修改，而附加信息每个租户独立，你可以随意修改。
                    </li>
                    <li>
                        2）要求是JSON格式，且总长度不超过5000字符；在获取用户信息时，会以extra字段补充到标准账号信息。
                    </li>
                    <li>
                        3）一些常见的适合存储在extra的数据包括：标准账号没提供但你需要的用户信息、用户在你的应用的偏好设置、你对某个用户的特殊备注等等。
                    </li>
                </ul>
            </>
        );
    }
}

export default connect(({ userPool }) => ({ userPool }))(UserExtra);
