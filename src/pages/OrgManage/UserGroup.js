import React, { PureComponent } from 'react'
import { Menu, Icon, Modal } from 'antd'
import Info from './Info'
import LinkUser from './LinkUser'
import { connect } from 'react-redux'
import http from '../../http'
import Card from '../../components/Card'
import { eventEmitter } from '../../utils'

const { Item } = Menu

const MENU_DATA = [
  { icon: 'info-circle', title: '用户组详情' },
  { icon: 'link', title: '关联用户' },
  { icon: 'delete', title: '删除', key: 'delete' },
]

class UserGroup extends PureComponent {
  state = {
    menuCurrent: '0',
  }

  componentDidUpdate ({ orgManage: { selectedKey } }) {
    if (selectedKey !== this.props.orgManage.selectedKey) this.setState({ menuCurrent: '0' })
  }

  onMenuClick = ({ key }) => {
    if (key === 'delete') {
      this.delete1()
    } else {
      this.setState({ menuCurrent: key })
    }
  }

  delete1 = () => {
    Modal.confirm({
      content: '删除后不可恢复，确认删除？',
      okText: '删除',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        const {
          orgManage: { selectedKey },
        } = this.props
        await http.delete('org-nodes/' + selectedKey)

        eventEmitter.emit('orgManage/initTree', { selectNode: 'neighbor' })
      },
    })
  }

  back2info = () => {
    this.setState({ menuCurrent: '0' })
  }

  render () {
    const { menuCurrent } = this.state

    let right
    switch (menuCurrent) {
      case '0':
        right = <Info/>
        break
      default:
        // 1
        right = <LinkUser type="USER_GROUP"/>
    }

    return (
      <>
        <div>
          <Menu
            onClick={this.onMenuClick}
            selectedKeys={[menuCurrent]}
            className="ctrlMenu"
            mode="inline"
          >
            {MENU_DATA.map((item, index) => (
              <Item key={item.key || String(index)}>
                <Icon type={item.icon}/>
                {item.title}
              </Item>
            ))}
          </Menu>
        </div>
        <div>
          <Card title={MENU_DATA[menuCurrent].title}>{right}</Card>
        </div>
      </>
    )
  }
}

export default connect(({ orgManage }) => ({ orgManage }))(UserGroup)
