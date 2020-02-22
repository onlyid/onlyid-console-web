import React, { PureComponent } from "react";
import { Button, Descriptions, Form, Input, message, Modal, Radio, Tooltip, Upload } from "antd";
import http, { baseURL } from "../../http";
import { GENDER_TEXT, IMG_UPLOAD_TIP, REG_EXP } from "../../constants";
import _ from "lodash";
import Avatar from "../../components/Avatar";

const { Item } = Form;
const { TextArea } = Input;

class AddOrEdit extends PureComponent {
    state = {
        avatarUrl: null,
        filename: null,
        dialogVisible: false,
        user2Add: {}
    };

    componentDidMount() {
        const { info } = this.props;
        if (info) {
            this.setState({ avatarUrl: info.avatarUrl });
        }
    }

    submit = () => {
        const { form, onSave, info } = this.props;
        const { filename } = this.state;

        form.validateFields(async (err, values) => {
            if (err) return;

            if (!values.mobile && !values.email) {
                message.error("手机号或邮箱至少填一项，作为登录账号");
                return;
            }

            values.filename = filename;

            // 编辑
            if (info) {
                await http.put("users/" + info.id, values);
                onSave();
            }
            // 新增
            else {
                await http.post("users", values);
                onSave();
            }

            message.success("保存成功");
        });
    };

    beforeUpload = file => {
        if (file.type !== "image/jpeg" && file.type !== "image/png") {
            message.error("只能是PNG、JPG或JPEG格式");
            return false;
        }

        if (file.size > 350000) {
            message.error("不能大于 350 KB");
            return false;
        }

        return true;
    };

    onUploadChange = ({ file }) => {
        if (file.status === "error") {
            const msg = _.get(file, "response.error", "上传失败，请重试");
            message.error(msg);
        } else if (file.status === "done") {
            this.setState({
                avatarUrl: URL.createObjectURL(file.originFileObj),
                filename: file.response.filename
            });
        }
    };

    checkPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (form.isFieldTouched("password1")) form.validateFields(["password1"]);

        callback();
    };

    checkPassword1 = (rule, value, callback) => {
        const { form } = this.props;
        const password = form.getFieldValue("password");
        if (password !== value) {
            callback("两次输入的密码不一致");
            return;
        }
        callback();
    };

    checkUserOnBlur = type => {
        const { form, info } = this.props;

        // 编辑状态 不需检查
        if (info) return;

        form.validateFields([type], async (errors, values) => {
            if (errors) return;

            if (!values[type]) return;

            const user = await http.get("users/by-mobile-or-email/", {
                params: { mobileOrEmail: values[type] }
            });
            if (user) this.setState({ dialogVisible: true, user2Add: user });
        });
    };

    onAddUser = async () => {
        const { onSave } = this.props;
        const { user2Add } = this.state;

        await http.post("users/link-tenant", { userId: user2Add.id });

        this.setState({ dialogVisible: false });
        onSave();
    };

    render() {
        const { onCancel, form, info } = this.props;
        const { getFieldDecorator } = form;
        const { avatarUrl, user2Add, dialogVisible } = this.state;

        return (
            <>
                <Form layout="vertical">
                    <Item>
                        <Upload
                            accept="image/jpeg,image/png"
                            name="file"
                            showUploadList={false}
                            action={baseURL + "/img"}
                            beforeUpload={this.beforeUpload}
                            onChange={this.onUploadChange}
                        >
                            <Tooltip title={IMG_UPLOAD_TIP}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center"
                                    }}
                                >
                                    <Avatar url={avatarUrl} cursorPointer />
                                    <Button type="link">上传头像</Button>
                                </div>
                            </Tooltip>
                        </Upload>
                    </Item>
                    <Item label="昵称">
                        {getFieldDecorator("nickname", {
                            initialValue: info && info.nickname,
                            rules: [
                                { required: true, message: "请填写" },
                                { max: 50, message: "最多输入50字" }
                            ]
                        })(<Input />)}
                    </Item>
                    <Item label="手机号" extra="手机号或邮箱至少填一项，作为登录账号">
                        {getFieldDecorator("mobile", {
                            initialValue: info && info.mobile,
                            rules: [
                                { max: 50, message: "最多输入50字" },
                                {
                                    pattern: REG_EXP.mobile,
                                    message: "手机号格式不正确"
                                }
                            ]
                        })(<Input onBlur={() => this.checkUserOnBlur("mobile")} />)}
                    </Item>
                    <Item label="邮箱">
                        {getFieldDecorator("email", {
                            initialValue: info && info.email,
                            rules: [
                                { max: 50, message: "最多输入50字" },
                                { type: "email", message: "邮箱格式不正确" }
                            ]
                        })(<Input onBlur={() => this.checkUserOnBlur("email")} />)}
                    </Item>
                    {!info && (
                        <>
                            <Item label="密码">
                                {getFieldDecorator("password", {
                                    rules: [
                                        { required: true, message: "请填写" },
                                        {
                                            min: 6,
                                            message: "密码最少要输入6位"
                                        },
                                        { max: 50, message: "最多输入50字" },
                                        { validator: this.checkPassword }
                                    ]
                                })(<Input.Password />)}
                            </Item>
                            <Item label="重复密码">
                                {getFieldDecorator("password1", {
                                    rules: [
                                        { required: true, message: "请填写" },
                                        { validator: this.checkPassword1 }
                                    ]
                                })(<Input.Password />)}
                            </Item>
                        </>
                    )}
                    <Item label="性别">
                        {getFieldDecorator("gender", {
                            initialValue: info && info.gender
                        })(
                            <Radio.Group>
                                {Object.keys(GENDER_TEXT).map(key => (
                                    <Radio value={key} key={key}>
                                        {GENDER_TEXT[key]}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        )}
                    </Item>
                    <Item label="备注">
                        {getFieldDecorator("description", {
                            initialValue: info && info.description,
                            rules: [{ max: 500, message: "最多输入500字" }]
                        })(<TextArea />)}
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
                <Modal
                    title="添加用户"
                    visible={dialogVisible}
                    onOk={this.onAddUser}
                    onCancel={() => this.setState({ dialogVisible: false })}
                >
                    <p>是否要添加用户：</p>
                    <div style={{ marginBottom: 15 }}>
                        <Avatar url={user2Add.avatarUrl} width={60} />
                    </div>
                    <Descriptions column={1}>
                        <Item label="昵称">{user2Add.nickname}</Item>
                        <Item label="手机号">{user2Add.mobile || "-"}</Item>
                        <Item label="邮箱">{user2Add.email || "-"}</Item>
                        <Item label="性别">
                            {user2Add.gender ? GENDER_TEXT[user2Add.gender] : "-"}
                        </Item>
                        <Item label="备注">{user2Add.description || "-"}</Item>
                    </Descriptions>
                </Modal>
            </>
        );
    }
}

export default Form.create()(AddOrEdit);
