import React, { PureComponent } from 'react';
import styles from './index.module.css';

export default class extends PureComponent {
  render() {
    const { children, title } = this.props;
    return (
      <div className={styles.card}>
        <div className={styles.title}>{title}</div>
        <div className={styles.content}>{children}</div>
      </div>
    );
  }
}
