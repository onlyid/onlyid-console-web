import React, { PureComponent } from 'react'
import { Badge, Icon, Menu } from 'antd'
import styles from './index.module.css'
import classNames from 'classnames'
import Logo from '../../assets/logo.png'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'

const { Item } = Menu

const MENU_DATA = {
  userPool: '用户池',
  orgManage: '组织机构',
  appRes: '应用权限',
  statistics: '统计数据',
  auditLog: '审计日志',
  admin: '系统管理',
}

class Header extends PureComponent {
  state = {
    menuCurrent: 'userPool',
  }

  componentDidMount () {
    const { pathname } = this.props.location
    const p = _.camelCase(pathname.split('/')[1])
    if (p in MENU_DATA) {
      this.setState({ menuCurrent: p })
    }
  }

  componentDidUpdate (prevProps) {
    const { pathname } = this.props.location
    if (prevProps.location.pathname === pathname) return

    const p = _.camelCase(pathname.split('/')[1])
    if (p in MENU_DATA) {
      this.setState({ menuCurrent: p })
    }
  }

  onMenuClick = ({ key }) => {
    const { history } = this.props
    this.setState({ menuCurrent: key })
    history.push('/' + _.kebabCase(key))
  }

  render () {
    const { menuCurrent } = this.state

    return (
      <div className={styles.header}>
        <div className={styles.box1bg}>
          <div className={styles.box1}>
            <img src={Logo}
                 alt="logo"
                 height="33"/>
            <Menu
              onClick={this.onMenuClick}
              selectedKeys={[menuCurrent]}
              mode="horizontal"
              className={styles.menu}
            >
              {Object.keys(MENU_DATA).map(key => <Item key={key}>{MENU_DATA[key]}</Item>)}
            </Menu>
            <div className={styles.right}>
              <Badge count={5}>
                <Icon type="bell"
                      className={styles.notification}/>
              </Badge>
              <i className={classNames('material-icons', styles.avatar)}>account_circle</i>
              <span className={styles.name}>ltb</span>
            </div>
          </div>
        </div>
        <div className={styles.box2bg}>
          <div className={styles.box2}>
            <span style={{ fontSize: 18 }}>{MENU_DATA[menuCurrent]}</span>
            <div id="headerPortal"/>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
