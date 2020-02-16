import React, { PureComponent } from 'react'
import { Form, Input, Button, message, Upload, Tooltip, Radio, Row, Col } from 'antd'
import http, { baseURL } from '../../http'
import { IMG_UPLOAD_TIP, REG_EXP } from '../../constants'
import _ from 'lodash'
import Avatar from '../../components/Avatar'
import { GENDER_TEXT } from '../../constants'

const { Item } = Form
const { TextArea } = Input

class AddOrEdit extends PureComponent {
  state = {
    avatarUrl: null,
    filename: null,
  }

  submit = () => {
    const { form, onSave, info } = this.props
    const { filename } = this.state

    form.validateFields(async (err, values) => {
      if (err) return

      // 编辑
      if (info) {
        await http.put('users/' + info.id, values)
        message.success('保存成功')
        onSave()
      }
      // 新增
      else {
        values.filename = filename
        await http.post('users', values)
      }
    })
  }

  beforeUpload = file => {
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      message.error('只能是PNG、JPG或JPEG格式')
      return false
    }

    if (file.size > 350000) {
      message.error('不能大于 350 KB')
      return false
    }

    return true
  }

  onUploadChange = ({ file }) => {
    if (file.status === 'error') {
      const msg = _.get(file, 'response.error', '上传失败，请重试')
      message.error(msg)
    } else if (file.status === 'done') {
      this.setState({
        avatarUrl: URL.createObjectURL(file.originFileObj),
        filename: file.response.filename,
      })
    }
  }

  validatePassword = (rule, value, callback) => {
    callback()
  }

  render () {
    const { onCancel, form, info } = this.props
    const { getFieldDecorator } = form
    const { avatarUrl } = this.state

    return (
      <Form layout="vertical">
        <Item>
          <Upload
            accept="image/jpeg,image/png"
            name="file"
            showUploadList={false}
            action={baseURL + '/img'}
            beforeUpload={this.beforeUpload}
            onChange={this.onUploadChange}
          >
            <Tooltip title={IMG_UPLOAD_TIP}>
              <Avatar url={avatarUrl}
                      cursorPointer/>
              <Button type="link">上传头像</Button>
            </Tooltip>
          </Upload>
        </Item>
        {/* TODO: 加个姓名 */}
        <Item label="昵称">
          {getFieldDecorator('nickname', {
            initialValue: info && info.nickname,
            rules: [
              { required: true, message: '请填写' },
              { max: 50, message: '不能超过50字' },
            ],
          })(<Input/>)}
        </Item>
        <Item label="手机号"
              extra="手机号或邮箱至少填一项，作为登录账号">
          <Row gutter={10}>
            <Col span={19}>
              {getFieldDecorator('mobile', {
                initialValue: info && info.mobile,
                rules: [
                  { max: 50, message: '不能超过50字' },
                  { pattern: REG_EXP.mobile, message: '手机号格式不正确' },
                ],
              })(<Input/>)}
            </Col>
            <Col span={5}>
              <Button type="primary">发送验证码</Button>
            </Col>
          </Row>
        </Item>
        <Item label="邮箱">
          {getFieldDecorator('email', {
            initialValue: info && info.email,
            rules: [
              { max: 50, message: '不能超过50字' },
              { type: 'email', message: '邮箱格式不正确' },
            ],
          })(<Input/>)}
        </Item>
        {!info && (
          <>
            <Item label="密码">
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: '请填写' },
                  { min: 6, message: '不能少于6个字符' },
                  { max: 50, message: '不能超过50字' },
                ],
              })(<Input.Password/>)}
            </Item>
            <Item label="重复输入密码">
              {getFieldDecorator('password1', {
                rules: [
                  { required: true, message: '请填写' },
                  { validator: this.validatePassword },
                ],
              })(<Input.Password/>)}
            </Item>
          </>
        )}
        <Item label="性别">
          {getFieldDecorator('gender', {
            initialValue: info && info.gender,
          })(
            <Radio.Group>
              {Object.keys(GENDER_TEXT).map(key => (
                <Radio value={key}
                       key={key}>
                  {GENDER_TEXT[key]}
                </Radio>
              ))}
            </Radio.Group>,
          )}
        </Item>
        <Item label="备注">
          {getFieldDecorator('description', {
            initialValue: info && info.description,
            rules: [{ max: 500, message: '不能超过500字' }],
          })(<TextArea/>)}
        </Item>
        <Item>
          <Button type="primary"
                  onClick={this.submit}>
            保存
          </Button>
          <Button onClick={onCancel}
                  style={{ marginLeft: 20 }}>
            取消
          </Button>
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddOrEdit)
