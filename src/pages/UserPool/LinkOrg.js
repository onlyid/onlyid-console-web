import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import Table from '../../components/Table'
import { Button, Input, message, Modal } from 'antd'
import http from '../../http'
import styles from './index.module.css'
import TreeLinkDialog from './TreeLinkDialog'

const { Search } = Input

class LinkOrg extends PureComponent {
  columns = [
    {
      title: '组织机构名称',
      dataIndex: 'name'
    },
    {
      title: '组织机构描述',
      dataIndex: 'description'
    },
    {
      title: '上级组织机构',
      dataIndex: 'parent.name'
    },
    {
      title: '操作',
      dataIndex: 'id',
      render: value => {
        return <Button onClick={() => this.delete1(value)}
                       type="link"
                       icon="delete">移除</Button>
      },
    },
  ]

  state = {
    list: [],
    keyword: '',
    loading: true,
    dialogVisible: false
  }

  componentDidMount () {
    this.initData()
  }

  initData = async () => {
    this.setState({ loading: true })

    const { keyword } = this.state
    const { userPool: { selectedKey } } = this.props
    const params = { keyword, userId: selectedKey }

    const list = await http.get('org-nodes/by-user-link', { params })
    this.setState({ list, loading: false })
  }

  delete1 = (id) => {
    Modal.confirm({
      content: '确定移除？',
      okType: 'danger',
      onOk: async () => {
        const { userPool: { selectedKey } } = this.props
        await http.post('org-nodes/unlink-user', { userId: selectedKey, orgNodeId: id })

        message.success('移除成功')
        this.initData()
      },
    })
  }

  onSearch = keyword => {
    this.setState({ keyword }, this.initData)
  }

  closeDialog = (refresh) => {
    this.setState({ dialogVisible: false })
    if (refresh) this.initData()
  }

  render () {
    const { list, loading, dialogVisible } = this.state

    return (
      <div className={styles.linkOrg}>
        <div className={styles.titleBox}>
          <span className={styles.title}>关联组织机构列表</span>
          <Button onClick={() => this.setState({ dialogVisible: true })}
                  type="primary"
                  icon="plus">
            关联更多
          </Button>
        </div>
        <Search onSearch={this.onSearch}
                placeholder="搜索组织机构名称"
                enterButton
                style={{ marginBottom: 20 }}/>
        <Table rowKey="id"
               dataSource={list}
               columns={this.columns}
               loading={loading}
               pagination={false}/>
        <TreeLinkDialog visible={dialogVisible}
                        type="ORG"
                        onClose={this.closeDialog}/>
      </div>
    )
  }
}

export default connect(({ userPool }) => ({ userPool }))(LinkOrg)