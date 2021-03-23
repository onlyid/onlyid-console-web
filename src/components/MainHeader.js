import React, { PureComponent } from "react";
import { ArrowBack } from "@material-ui/icons";
import { Button, Tooltip } from "@material-ui/core";
import styles from "./MainHeader.module.css";
import { withRouter } from "react-router-dom";
import http from "my/http";
import { transformImage } from "my/utils";

class MainHeader extends PureComponent {
    back = () => {
        const { history } = this.props;
        history.goBack();
    };

    onChange = async e => {
        const { files } = e.target;
        const { onUpload } = this.props;

        if (!files.length) return;

        const file = files[0];
        e.target.value = null;
        const { blob } = await transformImage(file);

        const formData = new FormData();
        formData.append("file", blob);
        const { filename } = await http.post("img", formData);

        onUpload(filename);
    };

    render() {
        const { backText, imgUrl, title, children, uploadTip } = this.props;
        return (
            <>
                <Button
                    onClick={this.back}
                    startIcon={<ArrowBack />}
                    size="small"
                    className={styles.backButton}
                >
                    {backText}
                </Button>
                <div className={styles.header}>
                    <div>
                        {uploadTip ? (
                            <>
                                <input
                                    accept="image/jpeg,image/png"
                                    id="upload"
                                    type="file"
                                    style={{ display: "none" }}
                                    onChange={this.onChange}
                                />
                                <label htmlFor="upload">
                                    <Tooltip title={uploadTip}>
                                        <img src={imgUrl} alt="icon" />
                                    </Tooltip>
                                </label>
                            </>
                        ) : (
                            <img src={imgUrl} alt="icon" />
                        )}
                    </div>
                    <div>
                        <h1>{title}</h1>
                        {children}
                    </div>
                </div>
            </>
        );
    }
}

export default withRouter(MainHeader);
