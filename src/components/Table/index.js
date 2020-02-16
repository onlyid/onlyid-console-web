import React, { PureComponent } from 'react'
import { Table } from 'antd'

export default class extends PureComponent {
  render () {
    const { pagination, columns, ...restProps } = this.props

    if (pagination) {
      if (pagination.showSizeChanger === undefined) pagination.showSizeChanger = true

      if (!pagination.showTotal) pagination.showTotal = total => `共 ${total} 项`
    }

    columns.forEach(item => {
      if (!item.render) item.render = value => value || '-'

      if (!item.align) item.align = 'center'
    })

    return <Table pagination={pagination}
                  columns={columns} {...restProps} />
  }
}
