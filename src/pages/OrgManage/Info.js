import React, { PureComponent } from 'react';
import { Descriptions, Button } from 'antd';
import http from '../../http';
import AddOrEdit from './AddOrEdit';
import { connect } from 'react-redux';
import { TYPE_LABEL } from '../../constants';

const { Item } = Descriptions;

class Info extends PureComponent {
  state = {
    info: {},
    isEdit: false,
  };

  componentDidMount() {
    this.initData();
  }

  componentDidUpdate({ orgManage: { selectedKey } }) {
    if (this.props.orgManage.selectedKey !== selectedKey) this.initData();
  }

  initData = async () => {
    const info = await http.get('org-nodes/' + this.props.orgManage.selectedKey);
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
    const {
      orgManage: { selectedType },
    } = this.props;

    if (isEdit) return <AddOrEdit info={info} onSave={this.onSave} onCancel={this.onCancel} />;

    const typeLabel = TYPE_LABEL[selectedType];

    return (
      <>
        <Descriptions column={1} layout="vertical" colon={false}>
          <Item label={`${typeLabel}名称`}>{info.name}</Item>
          <Item label={`${typeLabel}描述`}>{info.description || '-'}</Item>
          <Item label="上级组织机构">{info.parent && info.parent.name}</Item>
        </Descriptions>
        <Button onClick={this.showEdit} style={{ marginTop: 10, marginBottom: 24 }}>
          编辑
        </Button>
      </>
    );
  }
}

export default connect(({ orgManage }) => ({ orgManage }))(Info);
