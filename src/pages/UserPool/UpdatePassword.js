import React, { PureComponent } from "react";
import { Form, Input, Button, message } from "antd";
import { connect } from "react-redux";
import http from "my/http";

const { Password } = Input;

class UpdatePassword extends PureComponent {
    cancel = () => {
        const { onClose } = this.props;
        onClose();
    };

    submit = () => {
        const { form, onClose } = this.props;

        form.validateFields(async (err, fieldsValue) => {
            if (err) return;

            const {
                userPool: { selectedKey }
            } = this.props;

            await http.put("users/password", {
                userId: selectedKey,
                newPassword: fieldsValue.password1
            });

            message.success("保存成功");
            onClose();
        });
    };

    checkPassword1 = (rule, value, callback) => {
        const { form } = this.props;
        if (form.isFieldTouched("password2")) form.validateFields(["password2"]);

        callback();
    };

    checkPassword2 = (rule, value, callback) => {
        const { form } = this.props;
        const password1 = form.getFieldValue("password1");
        if (password1 !== value) {
            callback("两次输入的密码不一致");
            return;
        }
        callback();
    };

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;

        return (
            <Form layout="vertical">
                <Form.Item label="新密码">
                    {getFieldDecorator("password1", {
                        rules: [
                            { required: true, message: "请填写" },
                            {
                                min: 6,
                                message: "密码最少要输入6位"
                            },
                            { max: 50, message: "最多输入50字" },
                            { validator: this.checkPassword1 }
                        ]
                    })(<Password />)}
                </Form.Item>
                <Form.Item label="重复新密码">
                    {getFieldDecorator("password2", {
                        rules: [
                            { required: true, message: "请填写" },
                            { validator: this.checkPassword2 }
                        ]
                    })(<Password />)}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={this.submit}>
                        保存
                    </Button>
                    <Button onClick={this.cancel} style={{ marginLeft: 20 }}>
                        取消
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create()(connect(({ userPool }) => ({ userPool }))(UpdatePassword));
