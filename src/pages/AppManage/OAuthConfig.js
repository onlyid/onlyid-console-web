import React, { PureComponent } from "react";
import { Descriptions, Button, Form, Input, message, Modal, Tooltip } from "antd";
import http from "my/http";
import { connect } from "react-redux";
import styles from "./index.module.css";
import Validator from "async-validator";

const { Item } = Descriptions;

const RULE_URI = [{ required: true, type: "url" }];

class EditForm1 extends PureComponent {
    state = {
        uris: [],
        uri2add: ""
    };

    componentDidMount() {
        const { info } = this.props;
        this.setState({ uris: [...info.redirectUris] });
    }

    validate = async () => {
        const { info, form } = this.props;
        const { uris, uri2add } = this.state;
        console.log(uris);
        console.log(uri2add);

        if (info.type === "APP") {
            form.validateFields(async (err, values) => {
                if (err) return;

                this.submit(info.id, values);
            });
        } else {
            const uris2submit = [...uris];
            if (uri2add) uris2submit.push(uri2add);

            if (!uris2submit.length) {
                message.error("应用回调uri至少要填写一项");
                return;
            }

            const validator = new Validator({ uri: RULE_URI });
            for (let i = 0; i < uris2submit.length; i++) {
                const uri = uris2submit[i];
                try {
                    await validator.validate({ uri });
                } catch ({ errors }) {
                    message.error(`应用回调uri第${i + 1}项不是合法的url`);
                    return;
                }
            }

            this.submit(info.id, { redirectUris: uris2submit });
        }
    };

    submit = async (id, values) => {
        const { onSave } = this.props;

        await http.put(`clients/${id}/oauth-config`, values);

        onSave();
        message.success("保存成功");
    };

    onChange = (e, index) => {
        const { uris } = this.state;

        if (index !== undefined) {
            uris.splice(index, 1, e.target.value);
            this.setState({ uris: [...uris] });
        } else {
            this.setState({ uri2add: e.target.value });
        }
    };

    onUriAdd = () => {
        const { uri2add, uris } = this.state;

        this.setState({ uris: [...uris, uri2add], uri2add: "" });
    };

    onUriDelete = index => {
        const { uris } = this.state;

        uris.splice(index, 1);
        this.setState({ uris: [...uris] });
    };

    updateSecret = () => {
        const { info } = this.props;
        Modal.confirm({
            content: "一般仅在原secret泄漏时需要重置，重置后原secret马上失效，确认重置？",
            okType: "danger",
            onOk: async () => {
                const { secret } = await http.put(`clients/${info.id}/secret`);

                message.success("重置成功");
                info.secret = secret;
                this.forceUpdate();
            }
        });
    };

    render() {
        const { onCancel, info, form } = this.props;
        const { uri2add, uris } = this.state;
        const { getFieldDecorator } = form;

        const uris1 = uris.map((uri, index) => (
            <div key={String(index)} className={styles.uriBox}>
                <Input
                    value={uri}
                    className={styles.inputWithButton}
                    onChange={value => this.onChange(value, index)}
                />
                <Tooltip title="删除本项">
                    <Button
                        icon="delete"
                        type="danger"
                        className="buttonPlain"
                        onClick={() => this.onUriDelete(index)}
                    />
                </Tooltip>
                <br />
            </div>
        ));

        return (
            <Form layout="vertical">
                <Form.Item label="应用id">
                    <Input value={info.uid} disabled />
                </Form.Item>
                <Form.Item label="应用secret" required>
                    <Input value={info.secret} disabled className={styles.inputWithButton} />
                    <Tooltip title="重置secret">
                        <Button icon="reload" onClick={this.updateSecret} />
                    </Tooltip>
                </Form.Item>
                {info.type === "APP" ? (
                    <>
                        <Form.Item label="应用包名（Android）">
                            {getFieldDecorator("packageName", {
                                initialValue: info.packageName,
                                rules: [{ max: 50, message: "最多输入50字" }]
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="Bundle ID（iOS）">
                            {getFieldDecorator("bundleId", {
                                initialValue: info.bundleId,
                                rules: [{ max: 50, message: "最多输入50字" }]
                            })(<Input />)}
                        </Form.Item>
                    </>
                ) : (
                    <Form.Item label="应用回调uri" required>
                        {uris1}
                        <div className={styles.uriBox}>
                            <Input
                                value={uri2add}
                                onChange={this.onChange}
                                className={styles.inputWithButton}
                            />
                            <Tooltip title="新增一项">
                                <Button icon="plus" onClick={this.onUriAdd} />
                            </Tooltip>
                        </div>
                    </Form.Item>
                )}
                <Form.Item>
                    <Button type="primary" onClick={this.validate}>
                        保存
                    </Button>
                    <Button onClick={onCancel} style={{ marginLeft: 20 }}>
                        取消
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const EditForm = Form.create()(EditForm1);

class OAuthConfig extends PureComponent {
    state = {
        info: {
            redirectUris: []
        },
        isEdit: false
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const {
            appManage: { selectedKey }
        } = this.props;

        const info = await http.get("clients/" + selectedKey);
        this.setState({ info });
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
        const { info, isEdit } = this.state;

        if (isEdit) return <EditForm info={info} onSave={this.onSave} onCancel={this.onCancel} />;

        let redirectUris;
        if (info.redirectUris.length) {
            redirectUris = info.redirectUris.map((uri, index) => (
                <span className="uri" key={String(index)}>
                    {index + 1}. {uri}
                    <br />
                </span>
            ));
        } else {
            redirectUris = "-";
        }

        return (
            <>
                <Descriptions column={1} layout="vertical" colon={false}>
                    <Item label="应用id">{info.uid}</Item>
                    <Item label="应用secret">{info.secret}</Item>
                    {info.type === "APP" ? (
                        <>
                            <Item label="应用包名（Android）">{info.packageName || "-"}</Item>
                            <Item label="Bundle ID（iOS）">{info.bundleId || "-"}</Item>
                        </>
                    ) : (
                        <Item label="应用回调uri">{redirectUris}</Item>
                    )}
                </Descriptions>
                <Button onClick={this.showEdit} style={{ marginTop: 10, marginBottom: 24 }}>
                    编辑
                </Button>
            </>
        );
    }
}

export default connect(({ appManage }) => ({ appManage }))(OAuthConfig);
