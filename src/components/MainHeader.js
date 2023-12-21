import React, { PureComponent } from "react";
import { ArrowBack } from "@material-ui/icons";
import { Button } from "@material-ui/core";
import styles from "./MainHeader.module.css";
import { withRouter } from "react-router-dom";

class MainHeader extends PureComponent {
    back = () => {
        const { history } = this.props;
        history.goBack();
    };

    render() {
        const { backText, imgUrl, title, children } = this.props;

        let icon = null;
        if (imgUrl) icon = <img src={imgUrl} alt="icon" />;

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
                    <div>{icon}</div>
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
