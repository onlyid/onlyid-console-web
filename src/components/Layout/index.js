import React, { PureComponent } from 'react'
import styles from './index.module.css'
import Header from './Header'
import zhCN from 'antd/es/locale/zh_CN'
import { ConfigProvider } from 'antd'

class Layout extends PureComponent {
  render () {
    const { children } = this.props

    return (
      <ConfigProvider locale={zhCN}>
        <div className={styles.basicLayout}>
          <Header/>
          <div className={styles.content}>{children}</div>
          <div className={styles.footer}>
            &copy; 2015-{new Date().getFullYear()} &nbsp; 深圳市友全科技有限公司 &nbsp; All rights reserved.
          </div>
        </div>
      </ConfigProvider>
    )
  }
}

export default Layout
