import { useState, useEffect } from "react"
import { IconButton, Input, TablePagination } from "@material-ui/core"
import { FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage } from "@material-ui/icons"
import styles from "./index.module.css"

function Actions({ page, onPageChange, count, rowsPerPage }) {
    const [inputValue, setInputValue] = useState(1)

    useEffect(() => {
        setInputValue(page + 1)
    }, [page])

    const onClick = (event, type) => {
        let newPage
        switch (type) {
            case "first":
                newPage = 0
                break
            case "prev":
                newPage = page - 1
                break
            case "next":
                newPage = page + 1
                break
            default:
                // last
                newPage = Math.ceil(count / rowsPerPage) - 1
        }
        onPageChange(event, newPage)
        setInputValue(newPage + 1)
    }

    const onKeyUp = (event) => {
        if (event.key !== "Enter") return

        if (isNaN(inputValue)) {
            setInputValue(page + 1)
            return
        }

        let value = Math.round(inputValue) - 1

        if (value < 0) value = 0

        const maxPage = Math.ceil(count / rowsPerPage) - 1
        if (value > maxPage) value = maxPage

        setInputValue(value + 1)
        onPageChange(event, value)
    }

    const onChange = ({ target: { value } }) => {
        setInputValue(value)
    }

    const maxPage = Math.ceil(count / rowsPerPage) - 1

    return (
        <div className={styles.actionBox}>
            <IconButton
                onClick={(event) => onClick(event, "first")}
                disabled={page === 0}
                title="第一页"
            >
                <FirstPage />
            </IconButton>
            <IconButton
                onClick={(event) => onClick(event, "prev")}
                disabled={page === 0}
                title="上一页"
            >
                <KeyboardArrowLeft />
            </IconButton>
            <Input id="current-input" value={inputValue} onKeyUp={onKeyUp} onChange={onChange} /> /{" "}
            {maxPage + 1} 页
            <IconButton
                onClick={(event) => onClick(event, "next")}
                disabled={page >= maxPage}
                title="下一页"
            >
                <KeyboardArrowRight />
            </IconButton>
            <IconButton
                onClick={(event) => onClick(event, "last")}
                disabled={page >= maxPage}
                title="最后一页"
            >
                <LastPage />
            </IconButton>
        </div>
    )
}

export default function Pagination({
    count,
    rowsPerPage,
    page,
    onPageChange,
    onRowsPerPageChange
}) {
    return (
        <TablePagination
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            ActionsComponent={Actions}
            labelRowsPerPage="每页条数："
            labelDisplayedRows={({ count }) => `共 ${count} 条`}
            className={styles.pagination}
        />
    )
}
