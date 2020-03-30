import React, { PureComponent } from "react";

class TreeNodeTitle extends PureComponent {
    render() {
        const { title, keyword } = this.props;

        if (!keyword) return <span>{title}</span>;

        const index = title.indexOf(keyword);
        if (index === -1) return <span>{title}</span>;

        const beforeStr = title.substr(0, index);
        const afterStr = title.substr(index + keyword.length);

        return (
            <span>
                {beforeStr}
                <span style={{ color: "#f50" }}>{keyword}</span>
                {afterStr}
            </span>
        );
    }
}

export default TreeNodeTitle;
