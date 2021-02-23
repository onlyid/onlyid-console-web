import React from "react";
import { Dialog, DialogContent, DialogTitle, IconButton, Link } from "@material-ui/core";
import styles from "./HelpDialog.module.css";
import { Close as CloseIcon } from "@material-ui/icons";

export default function({ visible, onClose }) {
    return (
        <Dialog open={visible} onClose={onClose}>
            <DialogTitle>
                需要帮助？
                <IconButton className={styles.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent className={styles.content}>
                <h3 style={{ marginTop: 0 }}>
                    <span className="material-icons">menu_book</span> 查看文档
                </h3>
                <p>
                    <span style={{ fontWeight: "bold" }}>
                        <Link href="https://www.onlyid.net/home/docs" target="_blank">
                            开发文档
                        </Link>{" "}
                        是你了解唯ID、获取帮助的最重要途径
                    </span>
                    ，我们时刻保持文档最新，也建议你定期来看看。
                </p>
                <p>
                    特别的，我们总结了一些{" "}
                    <Link href="https://www.onlyid.net/home/docs/other/faq" target="_blank">
                        常见问题
                    </Link>
                    ，适合第一次接触唯ID的开发者，欢迎参阅。
                </p>
                <h3 style={{ marginTop: 22 }}>
                    <span className="material-icons">call</span> 联系我们
                </h3>
                <p>业务咨询和技术支持（或者其他建议反馈），请联系：</p>
                <ul className={styles.contactBox}>
                    <li>
                        电话/微信：<span className={styles.contact}>15521312099</span>
                    </li>
                    <li>
                        QQ：<span className={styles.contact}>452391310</span>
                    </li>
                    <li>
                        开发者QQ群：<span className={styles.contact}>23831587</span>
                    </li>
                </ul>
                <p>客服时间是每天9:00-21:00（节假日另行通知）。</p>
                <p>
                    生产问题请直接电话联系：
                    <span className={styles.contact}>15521312099</span>，
                    <span style={{ fontWeight: "bold" }}>7x24小时随时响应确保服务稳定运行</span>。
                </p>
                <p className="tip" style={{ marginBottom: 12 }}>
                    提示：唯ID不使用工单系统，请通过上述方式与我们联系，服务响应更及时，更快速解决问题。
                </p>
            </DialogContent>
        </Dialog>
    );
}
