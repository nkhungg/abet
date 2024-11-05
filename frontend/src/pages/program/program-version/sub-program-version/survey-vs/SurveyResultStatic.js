import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table } from "antd";
import { editVersionSurveyResultStatActionApi, getVersionSurveyResultStatActionApi, getVersionSurveyResultStatOptionsActionApi } from "../../../../../actions/api-actions/ProgramAction";
import { Select } from 'antd';

const { Option } = Select;

export default function SurveyResultStatic() {
    const { versionSurveyResultStat, versionSurveyResultStatOptions, selectedFlowProgramVersion } = useSelector((state) => state.GeneralProgramReducer);
    const { programVersionInfo, surveyName, surveyType, surveyLock } = selectedFlowProgramVersion;
    const dispatch = useDispatch();
    const [totalQuantity, setTotalQuantity] = useState(0)
    const [versionSurveyResultStatLocal, setVersionSurveyResultStatLocal] = useState([])
    const [surveyTypeLocal, setSurveyTypeLocal] = useState('')
    const [selectedRowStaticArray, setSelectedRowStaticArray] = useState([])

    console.log('versionSurveyResultStat', versionSurveyResultStat)

    useEffect(() => {
        // check surveyType
        let type = checkType(surveyType)
        setSurveyTypeLocal(type)
        dispatch(getVersionSurveyResultStatActionApi(programVersionInfo, surveyName, type));
        // eslint-disable-next-line react-hooks/exhaustive-deps
        if (versionSurveyResultStat.data) {
            let total = versionSurveyResultStat?.data?.reduce((total, ele) => {
                return total += (+ele.quantity)
            }, 0)
            setTotalQuantity(total)
            let totalRow = { level: 0, mark: "Total", quantity: totalQuantity, superviseId: null, surveyIndicatorId: null, }
            let dataUpdate = [...versionSurveyResultStat.data]
            dataUpdate.push(totalRow)
            setVersionSurveyResultStatLocal(dataUpdate)
        }
        // if(!surveyLock) {
        dispatch(getVersionSurveyResultStatOptionsActionApi())
        // }
    }, [programVersionInfo, surveyName, surveyType]);

    const handleChange = (mark, value) => {
        let changedRow = { mark: mark, level: value }
        console.log('changedRow', changedRow)

        let isContained = selectedRowStaticArray.find((ele) => ele.mark === changedRow.mark)
        if (isContained) {
            let selectedRowStaticArrayUpdate = selectedRowStaticArray.filter(ele => ele !== changedRow.mark)
            setSelectedRowStaticArray(selectedRowStaticArrayUpdate)
        } else {
            let selectedRowStaticArrayUpdate = [...selectedRowStaticArray]
            selectedRowStaticArrayUpdate.push(changedRow)
            setSelectedRowStaticArray(selectedRowStaticArrayUpdate)
        }
    }

    const checkType = (number) => {
        switch (number) {
            case 1:
                return 'supervisor'
            case 2:
                return 'reviewer'
            case 3:
                return 'member'
            case 4:
                return 'participant'
            case 5:
                return 'exit'
            case 6:
                return 'internship'
            default:
                break;
        }
    }
    const columns1 = [
        {
            title: 'Mark',
            dataIndex: 'mark',
            key: 'mark',
        },
        {
            title: 'Level',
            // key: 'level',
            render: (record) => {
                return <Select defaultValue={record.level} onChange={(e) => handleChange(record.mark, e)} style={{ width: 200, pointerEvents: `${!surveyLock ? 'none' : 'auto'}` }}>
                    {
                        versionSurveyResultStatOptions?.data?.map((opt, idx) => (<Option key={idx} value={opt.levelId}>{opt.levelName} - {opt.description}</Option>))
                    }
                </Select>
            }
        },
    ];

    const columns2 = [
        {
            title: 'Level',
            dataIndex: 'mark',
            key: 'mark',
            width: '100px',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            width: '100px',
        },
        {
            title: 'Percentage',
            width: '100px',
            render: (record) => {
                let ratio = (+(record?.quantity) * 100 / totalQuantity).toFixed(2)
                return <span>{ratio}</span>
            },
            sorter: (a, b) => {
                return b.quantity - a.quantity
            },
        },
    ];

    const postStatTable = () => {
        let data = {programVersionInfo, surveyName, surveyType: surveyTypeLocal, selectedRowStaticArray}
        dispatch(editVersionSurveyResultStatActionApi(data))
    }

    const cancelStatTable = () => {
        dispatch(getVersionSurveyResultStatActionApi(programVersionInfo, surveyName, surveyTypeLocal));
    }

    return (
        <>  {
            surveyLock && <div className="d-flex justify-content-start align-items-center">
                <Button type="primary" onClick={() => postStatTable()} className='mr-3'>Save</Button>
                <Button onClick={() => cancelStatTable()}>Cancel</Button>
            </div> 
        }
            
            <div className='d-flex justify-content-between align-items-center'>
                <Table pagination={false} dataSource={versionSurveyResultStat.data} columns={columns1} />;
                <Table pagination={false} dataSource={versionSurveyResultStatLocal} columns={columns2} />;
            </div>

        </>
    )
}
