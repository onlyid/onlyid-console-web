import EmptyPage from "components/EmptyPage";
import { Button } from "@material-ui/core";
import React from "react";

export default function({ onCreate, onImport }) {
    return (
        <EmptyPage
            title="用户管理"
            icon="person"
            description={
                <>
                    暂无用户；应用接入SSO后，登录的用户会出现在本页
                    <br />
                    也可以 "批量导入" 迁移已有应用的存量用户数据到唯ID
                </>
            }
        >
            <div>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<span className="material-icons">file_upload</span>}
                    onClick={onImport}
                >
                    批量导入
                </Button>
                <Button
                    variant="contained"
                    startIcon={<span className="material-icons">add</span>}
                    onClick={onCreate}
                    style={{ marginLeft: 30 }}
                >
                    单个新建
                </Button>
            </div>
        </EmptyPage>
    );
}
