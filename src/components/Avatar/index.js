import React, { PureComponent } from 'react'
import styles from './index.module.css'
import classNames from 'classnames'

class Avatar extends PureComponent {
  render () {
    const { url, width = 80, cursorPointer } = this.props

    const iconStyle = { fontSize: width }
    if (cursorPointer) iconStyle.cursor = 'pointer'

    return url ? (
      <img
        src={url}
        alt="avatar"
        className={styles.img}
        width={width}
        style={cursorPointer && { cursor: 'pointer' }}
      />
    ) : (
      <i className={classNames('material-icons', styles.icon)}
         style={iconStyle}>
        account_circle
      </i>
    )
  }
}

export default Avatar
