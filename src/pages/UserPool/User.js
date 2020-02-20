import React, { PureComponent } from 'react'
import { Menu, Icon, Modal } from 'antd'
import Info from './Info'
import UpdatePassword from './UpdatePassword'
import LinkOrg from './LinkOrg'
import { connect } from 'react-redux'
import http from '../../http'
import Card from '../../components/Card'
import styles from './index.module.css'
import { eventEmitter } from '../../utils'

const { Item } = Menu

const MENU_DATA = [
  { icon: 'arrow-left', title: '返回用户列表', key: 'back', className: styles.backMenuItem },
  { icon: 'info-circle', title: '用户详情' },
  { icon: 'link', title: '关联组织机构' },
  { icon: 'link', title: '关联岗位' },
  { icon: 'link', title: '关联用户组' },
  { icon: 'link', title: '关联角色' },
  { icon: 'lock', title: '修改密码' },
  { icon: 'delete', title: '删除', key: 'delete' },
]

class User extends PureComponent {
  state = {
    menuCurrent: '1',
  }

  componentDidUpdate ({ userPool: { selectedKey } }) {
    if (selectedKey !== this.props.userPool.selectedKey) this.setState({ menuCurrent: '1' })
  }

  onMenuClick = ({ key }) => {
    if (key === 'delete') {
      this.delete1()
    } else if (key === 'back') {
      const { dispatch } = this.props
      dispatch({ type: 'userPool/save', payload: { selectedKey: null } })
    } else {
      this.setState({ menuCurrent: key })
    }
  }

  delete1 = () => {
    Modal.confirm({
      content: '删除后不可恢复，确定删除？',
      okType: 'danger',
      onOk: async () => {
        const {
          userPool: { selectedKey },
        } = this.props
        await http.delete('users/' + selectedKey)

        eventEmitter.emit('userPool/refresh', true)
      },
    })
  }

  render () {
    const { menuCurrent } = this.state

    let right
    switch (menuCurrent) {
      case '1':
        right = <Info/>
        break
      case '2':
        right = <LinkOrg type="ORG"/>
        break
      case '3':
        right = <LinkOrg type="POSITION"/>
        break
      case '4':
        right = <LinkOrg type="USER_GROUP"/>
        break
      case '5':
        right = <LinkOrg type="ROLE"/>
        break
      default:
        // 6
        right = <UpdatePassword/>
    }

    return (
      <>
        <div>
          <Menu
            onClick={this.onMenuClick}
            selectedKeys={[menuCurrent]}
            className="ctrlMenu"
          >
            {MENU_DATA.map((item, index) => (
              <Item key={item.key || String(index)}
                    className={item.className}>
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

export default connect(({ userPool }) => ({ userPool }))(User)
