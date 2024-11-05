import { Switch } from 'antd'
import React, { useState } from 'react'
import './Style.css'

export default function DropdownSort({ defaultSort, sortList, updateSort, updateDefaultSort }) {
    const [isChecked, setChecked] = useState(true)
    const onChangeSwitch = (checked) => {
        setChecked(checked)
        updateSort('', checked)
    }

    const handleSort = (field) => {
        updateSort(field, isChecked)
        updateDefaultSort(field)
    }

    const upperCase = (text) => {
        return text[0].toUpperCase() + text.substring(1)
    }

    return (
        <div className="dropdown px-2 py-1 rounded-sm">
            <div className="dropdown-select">
                <span className="select mr-2">Sort by</span>
                <i className="fa fa-caret-down icon"></i>
            </div>
            <div className="dropdown-list pt-1 pb-2">
                {sortList.map((ele, idx) => <div onClick={() => handleSort(ele)} key={idx} className="dropdown-list__item d-flex justify-content-between align-items-center px-3" style={{ cursor: 'pointer' }}>
                    <span>{upperCase(ele)}</span>
                    <span>{defaultSort === ele && <i className="fa fa-check"></i>}</span>
                </div>)}
                <div style={{ borderTop: '1px solid #e6e6e6' }} className="dropdown-list__item px-3 mt-2 pt-2 d-flex justify-content-between align-items-center">
                    <span><i class="fa fa-sort-alpha-down"></i></span>
                    <Switch defaultChecked onChange={onChangeSwitch} />
                    <span><i class="fa fa-sort-alpha-up"></i></span>
                </div>
            </div>
        </div>
    )
}
