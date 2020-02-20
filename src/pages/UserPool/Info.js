import React, { PureComponent } from 'react';
import { Descriptions, Button } from 'antd';
import http from '../../http';
import AddOrEdit from './AddOrEdit';
import { connect } from 'react-redux';
import { GENDER_TEXT } from '../../constants';
import Avatar from '../../components/Avatar';
import { eventEmitter } from '../../utils'

const { Item } = Descriptions;

class Info extends PureComponent {
  state = {
    info: {},
    isEdit: false,
  };

  componentDidMount() {
    this.initData();
  }

  componentDidUpdate({ userPool: { selectedKey } }) {
    if (this.props.userPool.selectedKey !== selectedKey) this.initData();
  }

  initData = async () => {
    const info = await http.get('users/' + this.props.userPool.selectedKey);
    this.setState({ info });
  };

  showEdit = () => {
    this.setState({ isEdit: true });
  };

  onSave = () => {
    this.setState({ isEdit: false });
    this.initData();
    eventEmitter.emit('userPool/refresh')
  };

  onCancel = () => {
    this.setState({ isEdit: false });
  };

  render() {
    const { info, isEdit } = this.state;

    if (isEdit) return <AddOrEdit info={info} onSave={this.onSave} onCancel={this.onCancel} />;

    return (
      <>
        <div style={{ marginBottom: 20 }}>
          <Avatar url={info.avatarUrl} />
        </div>
        <Descriptions column={1} layout="vertical" colon={false}>
          <Item label="昵称">{info.nickname}</Item>
          <Item label="手机号">{info.mobile || '-'}</Item>
          <Item label="邮箱">{info.email || '-'}</Item>
          <Item label="性别">{info.gender ? GENDER_TEXT[info.gender] : '-'}</Item>
          <Item label="备注">{info.description || '-'}</Item>
        </Descriptions>
        <Button onClick={this.showEdit} style={{ marginTop: 10, marginBottom: 24 }}>
          编辑
        </Button>
      </>
    );
  }
}

export default connect(({ userPool }) => ({ userPool }))(Info);
