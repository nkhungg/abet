import { Button, Popconfirm, Select } from 'antd';
import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { programService } from '../../../../../../../services/ProgramService';
import { notifiFunction } from '../../../../../../../util/notification/Notification';

const text = "Are you sure to delete this task?";

const { Option } = Select;

export default function TestResult() {
    const { selectedFlowProgramVersion } = useSelector(
        (state) => state.GeneralProgramReducer
    );
    const [data, setStateData] = useState({});
    const [optionOutcomeList, setOptionOutcomeList] = useState([])
    const [optionClassList, setOptionClassList] = useState([])
    const [defaultClass, setDefaultClass] = useState(0)

    const [outcomeId, setOutcomeId] = useState(0)
    const [total, setTotal] = useState(0)

    const { programVersionInfo, testId, courseId, classId } = selectedFlowProgramVersion;

    useEffect(() => {
        if (programVersionInfo && courseId) {
            getClassList()
        }
        if (testId) getTestOutcomes()
    }, [programVersionInfo, courseId, testId])


    const getClassList = async () => {
        try {
            let result = await programService.getVersionCourseInstanceClassAll(programVersionInfo, courseId)
            if (result && result.data && result.data.data) {
                setOptionClassList(result.data.data)
                // setDefaultClass((result.data.data || [])[0].id);
                setDefaultClass(null);
            }
        } catch (e) {
            console.log(e)
        }
    }

    const getTestOutcomes = async () => {
        try {
            let result = await programService.getVersionCourseInstanceTestOutcome(testId, 1, 1000)
            if (result && result.data && result.data.data) {
                let outcomeId = (result.data.data[0] || {}).courseOutcomeId
                setOptionOutcomeList(result.data.data)
                setOutcomeId(outcomeId)
                getMatrix(testId, outcomeId, defaultClass)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const getMatrix = async (testId, outcomeId, classId) => {
        programService
            .getVersionCourseInstanceClassTestResult(testId, outcomeId, classId ? classId : 0)
            .then((res) => {
                setTotal(res.data.data?.rowList?.length)
                setStateData(res.data.data);
            })
            .catch((e) => console.log(e));
    }

    const confirm = (eleCell) => {
        deleteGrading(eleCell)
    }
    const handleChangeClass = (value) => {
        setDefaultClass(value)
    }

    const handleChangeCourseOutcome = (value) => {
        setOutcomeId(value)
    }

    const deleteGrading = async (cellInfo) => {
        try {
            let result = await programService.deleteVersionCourseInstanceClassTestResult(
                testId,
                outcomeId,
                cellInfo
            );
            if (result) {
                notifiFunction("success", "Delete course successfully!");
            }
            getMatrix(testId, outcomeId, defaultClass);
        } catch (e) {
            notifiFunction("error", "Delete course failed!");
            console.log(e);
        }
    }

    const renderOptionClassList = () => {
        return optionClassList.map((itm, idx) => {
            return (
                <Option
                    key={`${itm.id}-${idx}`}
                    value={itm.id}
                >
                    {itm.name} - {itm.lecturerName}
                </Option>
            );
        });
    }

    const renderOptionCourseOutcomeList = () => {
        return optionOutcomeList.map((itm, idx) => {
            return (
                <Option
                    title={itm.description}
                    key={`${itm.courseOutcomeId}-${idx}`}
                    value={itm.courseOutcomeId}
                >
                    {itm.name} - {itm.description}
                </Option>
            );
        });
    }


    return (
        <div className="matrix-class-test my-4">
            <div className="d-flex justify-content-between align-items-center my-4">
                <h6 className="m-0">
                    <Select
                        className="mr-3"
                        style={{ width: 250 }}
                        onChange={handleChangeClass}
                        value={defaultClass}
                        placeholder="All"
                    >
                        {renderOptionClassList()}
                    </Select>

                    <Select
                        className="mr-3"
                        style={{ width: 250 }}
                        onChange={handleChangeCourseOutcome}
                        value={outcomeId}
                    >
                        {renderOptionCourseOutcomeList()}
                    </Select>

                    <Button
                        onClick={() => getMatrix(testId, outcomeId, defaultClass)}
                        className="mr-3"
                        type="primary"
                    >
                        View
                    </Button>
                </h6>
            </div>
            {data?.columnList?.length > 1 && data?.rowList?.length > 0 ? (
                <div>
                    <table
                        id="matrix-peo-outcome"
                        className="responsive-table-input-matrix"
                    >
                        <thead className='text-left' style={{ fontSize: "14px" }}>
                            <tr>
                                {data?.columnList.map((peo, idx) => {
                                    return (
                                        <th style={{ width: "120px" }} key={idx}>
                                            {peo}{idx === 0 ? ` (${total})` : ''}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {data?.rowList.map((row, rowIdx) => {
                                return (
                                    <tr
                                        style={{ height: "32px" }}
                                        className={rowIdx % 2 === 0 ? "rowHighlight" : ""}
                                        key={rowIdx}
                                    >
                                        <td className='text-left' style={{ width: "120px" }}>{row.title}</td>
                                        {data?.rowList[rowIdx].data.map((eleCell, idx) => {
                                            return (
                                                <td
                                                    className="cell"
                                                    key={idx}
                                                    style={{ width: "120px", padding: '15px 10px', paddingLeft: '0'}} 
                                                >
                                                    <span className="d-flex justify-content-between align-items-center">
                                                        <span>
                                                            {(eleCell || {}).score || "N/A"}
                                                        </span>
                                                        <Popconfirm
                                                            placement="topRight"
                                                            title={text}
                                                            onConfirm={() => confirm(eleCell)}
                                                            okText="Yes"
                                                            cancelText="No"
                                                        >
                                                            <span
                                                                className="trash-bin-icon"
                                                                style={{ color: "#595959", cursor: "pointer" }}
                                                            >
                                                                <i className="fa fa-trash-alt"></i>
                                                            </span>
                                                        </Popconfirm>
                                                    </span>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center text-danger">
                    <FormattedMessage id="NO_DATA" />
                </div>
            )}
        </div>
    )
}
