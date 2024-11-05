import { Button, Select, Table } from 'antd';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editVersionSurveyResultStatActionApi, getVersionSurveyResultStatActionApi, getVersionSurveyResultStatOptionsActionApi } from '../../../../../../actions/api-actions/ProgramAction';

const { Option } = Select

const TableLeft = () => {
    const { versionSurveyResultStat, versionSurveyResultStatOptions, selectedFlowProgramVersion } = useSelector((state) => state.GeneralProgramReducer)
    const { data } = versionSurveyResultStat || {}
    const { stat } = data || []
    const { isLock } = data || false
    const [leftData, setLeftData] = useState([])
    const [changedStat, setChangedStat] = useState([])
    const dispatch = useDispatch();
    const { programVersionInfo, surveyName } = selectedFlowProgramVersion
   
    useEffect(() => {
        if(stat) {
            let dataUpdate = stat.map((ele, idx) => {
                return {...ele, key: idx}
            })
            setLeftData(dataUpdate)
        }
        if(!isLock) {
            dispatch(getVersionSurveyResultStatOptionsActionApi())
        }
        
    }, [versionSurveyResultStat, data, stat])

    const handleChange = (mark, value) => {
        let updateLeftData = leftData.map(ele => {
            if (ele.mark === mark) ele.level = value;
            return ele;
        })
        let updateStat = changedStat.filter(ele => ele.mark !== mark);
        updateStat.push({mark, level: value})
        setChangedStat(updateStat)
        setLeftData(updateLeftData)
    }

    const renderLevelOptions = () => {
        return versionSurveyResultStatOptions?.data?.map((opt, idx) => {
            return <Option key={idx} value={+opt.levelId}>{opt.levelName} - {opt.description}</Option>
        })
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
                return <Select value={record.level} onSelect={(e) => handleChange(record.mark, e)} style={{ width: 200, pointerEvents: `${versionSurveyResultStat?.data?.isLock ? 'none' : 'auto'}` }}>
                { renderLevelOptions() }
                </Select>
            }
        },
    ];
    const cancelStatTable = () => {
        dispatch(getVersionSurveyResultStatActionApi(programVersionInfo, surveyName, 'ce-participant'));
    }

    const saveStatTable = () => {
        let data = {programVersionInfo, surveyName, surveyType: 'ce-participant', selectedRowStaticArray: changedStat}
        dispatch(editVersionSurveyResultStatActionApi(data))
    }

    return <div className='d-flex flex-column justify-content-between align-items-start'>
        <Table pagination={false} dataSource={leftData} columns={columns1} />
        {!isLock && <div className='mt-3'>
        <Button onClick={() => saveStatTable()} className='mr-3' type='primary'>Save</Button>
        <Button onClick={() => cancelStatTable()}>Cancel</Button>
        </div>}
    </div>;
}

const TableRight = () => {
    const { versionSurveyResultStat } = useSelector((state) => state.GeneralProgramReducer);
    const { data } = versionSurveyResultStat || {}
    const { stat } = data || []
    const [total, setTotal] = useState(0)
    const [rightData, setRightData] = useState([])

    useEffect(() => {
        if(stat) {
            let sum = stat.reduce((total, ele) => total + ele.quantity, 0)
            setTotal(sum)
            stat.push({mark: "Total", quantity: sum})
            let dataUpdate = stat.map((ele, idx) => {
                return {...ele, key: idx}
            })
            setRightData(dataUpdate)
        }
    }, [versionSurveyResultStat, data, stat])

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
            sorter: (a, b) => {
                return b.quantity - a.quantity
            },
        },
        {
            title: 'Percentage',
            width: '100px',
            key: 'percent',
            render: (record) => {
                return <span>{ total ? ((record.quantity*100)/total).toFixed(2) : 0 }</span> 
            },
            sorter: (a, b) => {
                return b.quantity - a.quantity
            },
        },
    ];
    return <Table pagination={false} dataSource={rightData} columns={columns2} />;
}

export default function CeParticipantStat() {
    const { versionSurveyResultStat, selectedFlowProgramVersion } = useSelector((state) => state.GeneralProgramReducer);
    const { programVersionInfo, surveyName } = selectedFlowProgramVersion;
    const dispatch = useDispatch()

    useEffect(() => {
        if(programVersionInfo && surveyName) {
            dispatch(getVersionSurveyResultStatActionApi(programVersionInfo, surveyName, 'ce-participant'));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [programVersionInfo, surveyName])

    return (
        <>
            <div className='pb-3 d-flex justify-content-around align-items-start'>
                { versionSurveyResultStat && versionSurveyResultStat.data && <>
                    <TableLeft />
                    <TableRight />
                </>
                }
            </div>
        </>
    )
}
