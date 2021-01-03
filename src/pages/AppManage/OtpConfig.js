import React, { PureComponent } from "react";
import http from "my/http";
import { Button, Descriptions, Form, message, Radio, Select } from "antd";
import { connect } from "react-redux";
import {
    OTP_EXPIRE_TEXT,
    OTP_FAIL_TEXT,
    OTP_LENGTH_TEXT,
    OTP_TEMPLATE_TEXT,
    OTP_TYPE_TEXT
} from "my/constants";

const { Item } = Descriptions;
const { Option } = Select;

class Edit extends PureComponent {
    submit = () => {
        const { form, onSave, info } = this.props;

        form.validateFields(async (err, values) => {
            if (err) return;

            await http.put(`clients/${info.clientId}/otp-config`, values);

            onSave();
            message.success("保存成功");
        });
    };

    render() {
        const {
            info,
            form: { getFieldDecorator },
            onCancel
        } = this.props;

        return (
            <Form layout="vertical">
                <Form.Item label="验证码长度">
                    {getFieldDecorator("length", {
                        initialValue: String(info.length)
                    })(
                        <Radio.Group>
                            {Object.keys(OTP_LENGTH_TEXT).map(key => (
                                <Radio key={key} value={key}>
                                    {OTP_LENGTH_TEXT[key]}
                                </Radio>
                            ))}
                        </Radio.Group>
                    )}
                </Form.Item>
                <Form.Item label="验证码类型">
                    {getFieldDecorator("type", {
                        initialValue: info.type
                    })(
                        <Radio.Group>
                            {Object.keys(OTP_TYPE_TEXT).map(key => (
                                <Radio key={key} value={key}>
                                    {OTP_TYPE_TEXT[key]}
                                </Radio>
                            ))}
                        </Radio.Group>
                    )}
                </Form.Item>
                <Form.Item label="验证码有效期">
                    {getFieldDecorator("expireMin", {
                        initialValue: String(info.expireMin)
                    })(
                        <Radio.Group>
                            {Object.keys(OTP_EXPIRE_TEXT).map(key => (
                                <Radio key={key} value={key}>
                                    {OTP_EXPIRE_TEXT[key]}
                                </Radio>
                            ))}
                        </Radio.Group>
                    )}
                </Form.Item>
                <Form.Item label="最多失败次数">
                    {getFieldDecorator("maxFailCount", {
                        initialValue: String(info.maxFailCount)
                    })(
                        <Radio.Group>
                            {Object.keys(OTP_FAIL_TEXT).map(key => (
                                <Radio key={key} value={key}>
                                    {OTP_FAIL_TEXT[key]}
                                </Radio>
                            ))}
                        </Radio.Group>
                    )}
                </Form.Item>
                <Form.Item label="验证码模板">
                    {getFieldDecorator("template", {
                        initialValue: String(info.template)
                    })(
                        <Select>
                            {Object.keys(OTP_TEMPLATE_TEXT).map(key => (
                                <Option key={key} value={key}>
                                    {OTP_TEMPLATE_TEXT[key]}
                                </Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="是否重用">
                    {getFieldDecorator("reuse", {
                        initialValue: info.reuse
                    })(
                        <Radio.Group>
                            <Radio value={true}>是</Radio>
                            <Radio value={false}>否</Radio>
                        </Radio.Group>
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={this.submit}>
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

const EditForm = Form.create()(Edit);

class OtpConfig extends PureComponent {
    state = {
        info: {},
        isEdit: false
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const {
            appManage: { selectedKey }
        } = this.props;

        const info = await http.get(`clients/${selectedKey}/otp-config`);
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

        return (
            <>
                {isEdit ? (
                    <EditForm info={info} onSave={this.onSave} onCancel={this.onCancel} />
                ) : (
                    <>
                        <Descriptions column={1} layout="vertical" colon={false}>
                            <Item label="验证码长度">{OTP_LENGTH_TEXT[info.length]}</Item>
                            <Item label="验证码类型">{OTP_TYPE_TEXT[info.type]}</Item>
                            <Item label="验证码有效期">{OTP_EXPIRE_TEXT[info.expireMin]}</Item>
                            <Item label="最多失败次数">{OTP_FAIL_TEXT[info.maxFailCount]}</Item>
                            <Item label="验证码模板">{OTP_TEMPLATE_TEXT[info.template]}</Item>
                            <Item label="是否重用">{info.reuse ? "是" : "否"}</Item>
                        </Descriptions>
                        <Button onClick={this.showEdit} style={{ marginTop: 10, marginBottom: 24 }}>
                            编辑
                        </Button>
                    </>
                )}
                <ul className="tip ulTip">
                    <li>
                        1）在发送单条验证码时，也可以直接通过API传参的方式自定义，且优先级更高，请参阅使用OTP的相关文档。
                    </li>
                    <li>
                        2）最多失败次数：当某条验证码校验失败次数达到该值后，标记验证码失效，后续校验都直接返回失败，不再尝试校验。
                    </li>
                    <li>
                        3）验证码模板：APP指代你的应用名，X是有效期，Y是验证码，发送时会替换成具体的值。
                    </li>
                    <li>
                        4）是否重用：当发送给某用户的一条验证码未过期时再发送一条，会重用前一条验证码，并更新有效期，可以避免用户在短时间收到多条不一样的验证码。
                    </li>
                </ul>
            </>
        );
    }
}

export default connect(({ appManage }) => ({ appManage }))(OtpConfig);
