import React, { useEffect, useState } from "react";
import { Table, Input, Pagination, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { getVersionSurveyQuestionActionApi } from "../../../../../actions/api-actions/ProgramAction";
import { ADD_INFO_COURSE_DRAWER, SET_EDIT_VERSION_SURVEY_QUESTION, SET_EDIT_VERSION_SURVEY_QUESTION_ANSWER } from "../../../../../redux/types";
import FormVersionSurveyQuestion from "../../../../../components/form-version-survey-question/FormVersionSurveyQuestion";
import FormVersionSurveyQuestionAnswer from "../../../../../components/form-version-survey-question-answer/FormVersionSurveyQuestionAnswer";
import { programService } from "../../../../../services/ProgramService";
import parse from "react-html-parser";
import { SearchOutlined } from "@ant-design/icons";
import DropdownSort2 from "../../../../../components/dropdown-sort/DropdownSort2";

export default function SurveyQuestion() {
    const [isAscending, setAscending] = useState(true)
    const [defaultSort, setDefaultSort] = useState('indicatorName')
    const sortList = ['indicatorName', 'maxGrade', 'description', 'priority', 'outcome', 'additionalQuestion']
    const [searchedObj, setSearchedObj] = useState([])
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();
    const {
        selectedFlowProgramVersion,
        versionSurveyQuestion,
    } = useSelector((state) => state.GeneralProgramReducer);

    const { programVersionInfo, surveyName } = selectedFlowProgramVersion;

    useEffect(() => {
        if (programVersionInfo && surveyName) {
            dispatch(getVersionSurveyQuestionActionApi(programVersionInfo, surveyName, 1, []));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [programVersionInfo, surveyName]);

    const onChange = async (page) => {
        setPage(page);
        if (programVersionInfo && surveyName) {
            dispatch(getVersionSurveyQuestionActionApi(programVersionInfo, surveyName, page, searchedObj));
        }
    };

    const handleSearch = () => {
        if (programVersionInfo && surveyName) {
            dispatch(getVersionSurveyQuestionActionApi(programVersionInfo, surveyName, page, searchedObj));
        }
    }

    const handleReset = (dataIndex, clearFilters) => {
        clearFilters();
        let searchedObjUpdate = searchedObj.filter(item => item.key !== dataIndex)
        setSearchedObj(searchedObjUpdate)
        if (programVersionInfo && surveyName) {
            dispatch(getVersionSurveyQuestionActionApi(programVersionInfo, surveyName, page, searchedObjUpdate));
        }
    }

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div className='d-flex justify-content-between align-items-center p-3'>
                <Input
                    className='mr-3'
                    value={selectedKeys[0]}
                    onChange={e => {
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                        let newSearchArray = updateSearchObj(dataIndex, e.target.value, [...searchedObj])
                        setSearchedObj(newSearchArray)
                    }}
                    onPressEnter={() => handleSearch()}
                />
                <span onClick={() => handleReset(dataIndex, clearFilters)} size="small" style={{ width: 38, cursor: 'pointer' }}>
                Reset
                </span>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    });

    const updateSearchObj = (dataIndex, val, searchedObjUpdate) => {
        let idx = searchedObj.findIndex(item => item.key === dataIndex)
        if (idx < 0) {
            let obj = {
                key: dataIndex,
                val: val
            }
            searchedObjUpdate.push(obj)
        } else {
            searchedObjUpdate[idx].val = val
        }
        return searchedObjUpdate
    }

    const updateSortBy = (value) => {
        let newSearchArraysortBy = updateSearchObj('sortBy', value, [...searchedObj])
        newSearchArraysortBy = updateSearchObj('orderBy', isAscending ? 'asc' : 'desc', newSearchArraysortBy)
        setSearchedObj(newSearchArraysortBy)
    }

    const updateDefaultCheck = (sortField) => {
        setDefaultSort(sortField)
    }

    const updateAscending = (hasAscending) => {
        setAscending(hasAscending)
        let newSearchArraysortBy = updateSearchObj('orderBy', hasAscending ? 'asc' : 'desc', searchedObj)
        setSearchedObj(newSearchArraysortBy)
    }

    const clearAllSearch = () => {
        if (programVersionInfo && surveyName) {
            dispatch(getVersionSurveyQuestionActionApi(programVersionInfo, surveyName, 1, []));
        }
        setSearchedObj([])
        setPage(1)
        setDefaultSort('indicatorName')
        setAscending(true)
    }


    const expandedRowRender = (record) => {
        const columns = [
            {
                title: "Answer",
                dataIndex: "levelId",
                key: "levelId",
                width: "100px",
                fixed: "left",
            },
            {
                title: "Description",
                dataIndex: "description",
                key: "description",
            },
            {
                title: "Grade",
                key: "comment",
                width: "200px",
                render: (text, record, index) => {
                    let convertFlag = (num) => +num === 1 ? '<' : (+num === 2 ? '<=' : '=');
                    let prefix = record.minGrade ? record.minGrade + ' ' + convertFlag(record.minGradeFlag) : ''
                    let postfix = record.maxGrade ? convertFlag(record.maxGradeFlag) + ' ' + record.maxGrade : ''
                    let infix = record.minGrade || record.maxGrade ? ' Grade ' : ''
                    return prefix + infix + postfix
                }
            },
            {
                title: "Action",
                dataIndex: "operation",
                key: "operation",
                width: "80px",
                fixed: "right",
                render: (text, record, index) => (
                    <span className="d-flex justify-content-between align-items-center">
                        <span
                            style={{ color: '#929292' }}
                            onClick={() => {
                                const action1 = {
                                    type: ADD_INFO_COURSE_DRAWER,
                                    title: "EDIT ANSWER",
                                    Component: <FormVersionSurveyQuestionAnswer />,
                                };

                                //dispatch lên reducer nội dung drawer
                                dispatch(action1);
                                const action2 = {
                                    type: SET_EDIT_VERSION_SURVEY_QUESTION_ANSWER,
                                    payload: { ...record, isEdit: true },
                                };
                                dispatch(action2);
                                //dispatch dữ liệu dòng hiện tai lên reducer
                            }}
                            className="btn-edit mr-3"
                        >
                            <i className="fa fa-edit"></i>
                        </span>
                    </span>
                ),
            },
        ];

        const data = record?.answerSet?.map((item, idx) => {
            return { ...item, key: `${item.levelId}-${idx}`, id: record.id };
        });

        return <Table className="child-test-question" columns={columns} dataSource={data} pagination={false} />;
    };

    const columns = [
        {
            title: "STT",
            dataIndex: "key",
            key: "key",
            fixed: "left",
            width: "60px",
        },
        {
            title: "Indicator Name",
            dataIndex: "indicatorName",
            key: "indicatorName",
            width: "150px",
            fixed: "left",
            ...getColumnSearchProps("indicatorName"),
        },
        {
            title: "Max grade",
            dataIndex: "maxGrade",
            key: "maxGrade",
            width: "100px",
            ...getColumnSearchProps("maxGrade"),
        },
        {
            title: "Description",
            key: "description",
            width: "300px",
            render: (record) => (
                <span>{parse(record.description)}</span>
            ),
            ...getColumnSearchProps("description"),
        },
        {
            title: "Priority",
            dataIndex: "priority",
            key: "priority",
            width: "80px",
            ...getColumnSearchProps("priority"),
        },
        {
            title: "Outcome",
            dataIndex: "outcome",
            key: "outcome",
            width: "100px",
            ...getColumnSearchProps("outcome"),
        },
        {
            title: "Additional Question",
            dataIndex: "additionalQuestion",
            key: "additionalQuestion",
            width: "150px",
            ...getColumnSearchProps("additionalQuestion"),
        },
        {
            title: "Comment",
            key: "comment",
            width: "100px",
            render: (record) => (
                <span>{record.comment ? 'YES' : 'NO'}</span>
            )
        },
        {
            title: "Action",
            key: "operation",
            render: (record) => (
                <span className="d-flex justify-content-between align-items-center">
                    <span
                        onClick={() => {
                            const action1 = {
                                type: ADD_INFO_COURSE_DRAWER,
                                title: "EDIT SURVEY QUESTION",
                                Component: <FormVersionSurveyQuestion />,
                            };

                            //dispatch lên reducer nội dung drawer
                            dispatch(action1);
                            const action2 = {
                                type: SET_EDIT_VERSION_SURVEY_QUESTION,
                                payload: { ...record, isEdit: true },
                            };
                            dispatch(action2);
                            //dispatch dữ liệu dòng hiện tai lên reducer
                        }}
                        className="btn-edit mr-3"
                        style={{ color: '#929292' }}
                    >
                        <i className="fa fa-edit"></i>
                    </span>
                    <span
                        onClick={() => {
                            const action1 = {
                                type: ADD_INFO_COURSE_DRAWER,
                                title: "ADD NEW ANSWER",
                                Component: <FormVersionSurveyQuestionAnswer />,
                            };

                            //dispatch lên reducer nội dung drawer
                            dispatch(action1);
                            const action2 = {
                                type: SET_EDIT_VERSION_SURVEY_QUESTION_ANSWER,
                                payload: { id: record.id, isEdit: false },
                            };
                            dispatch(action2);
                            //dispatch dữ liệu dòng hiện tai lên reducer
                        }}
                        className="btn-edit mr-3"
                        style={{ color: '#929292' }}
                    >
                        <i className="fa fa-plus-circle"></i>
                    </span>
                </span>
            ),
            width: "80px",
            fixed: "right",
        },
    ];

    const data = versionSurveyQuestion?.data?.map(
        (question, idx) => {
            return { ...question, key: (page - 1) * 10 + idx + 1 };
        }
    );

    const exportToWord = async (filename = '') => {
        let contentHTML = ''
        try {
            let result = await programService.getExportToWordSurveyQuestion(programVersionInfo, surveyName)
            if (result) contentHTML = result.data
        } catch (err) {
            console.log('err', err);
        }

        var blob = new Blob(['\ufeff', contentHTML], {
            type: 'application/msword'
        });

        // Specify link url
        var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(contentHTML);

        // Specify file name
        filename = filename ? filename + '.doc' : 'document.doc';

        // Create download link element
        var downloadLink = document.createElement("a");

        document.body.appendChild(downloadLink);

        if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            // Create a link to the file
            downloadLink.href = url;

            // Setting the file name
            downloadLink.download = filename;

            //triggering the function
            downloadLink.click();
        }
        document.body.removeChild(downloadLink);
    }

    return (
        <div className="wrapper-outcome">
            <h5 className="mb-0">
                <FormattedMessage id="SURVEY_QUESTION" />
            </h5>

            <div className="mb-3 d-flex justify-content-end align-items-center">

                <div className="d-flex justify-content-center align-items-center wrapper-icon" style={{ fontSize: '16px', color: '#66615b' }}>
                    <a style={{ color: 'rgb(102, 97, 91)' }} target="_blank" href={`http://13.214.16.222:8000/api/program-instances/${programVersionInfo}/surveys/${surveyName}/export`} className="icon mr-3"><i className="fa fa-eye"></i></a>
                    <span
                        onClick={() => {
                            let action = {
                                type: ADD_INFO_COURSE_DRAWER,
                                title: "ADD NEW SURVEY QUESTION",
                                Component: <FormVersionSurveyQuestion />,
                            };
                            dispatch(action);
                            const action2 = {
                                type: SET_EDIT_VERSION_SURVEY_QUESTION,
                                payload: { isEdit: false },
                            };
                            dispatch(action2);
                        }}
                        className="icon mr-3"
                    >
                        <i className="fa fa-plus"></i>
                    </span>
                    {/* <span className="icon mr-3">
                        <i className="fa fa-columns"></i>
                    </span> */}
                    <span title="Refresh page" onClick={() => clearAllSearch()} className="icon mr-3">
                        <i className="fa fa-sync-alt"></i>
                    </span>
                    <DropdownSort2
                        isAscending={isAscending}
                        updateAscending={updateAscending}
                        defaultSort={defaultSort}
                        sortList={sortList}
                        updateSort={updateSortBy}
                        updateDefaultSort={updateDefaultCheck}
                    />
                    <Button className='mx-3' type='primary' onClick={() => handleSearch()}>Search</Button>
                    <Button onClick={() => exportToWord(`survey-question-${programVersionInfo}-${surveyName}`)} type='primary'><i className="fa fa-file-export mr-2"></i>Export to Word</Button>
                </div>
            </div>
            <Table
                scroll={{ x: 992 }}
                className="components-table-demo-nested"
                columns={columns}
                expandable={{ expandedRowRender }}
                dataSource={data}
            />
            <div className="d-flex justify-content-center my-3">
                <Pagination
                    current={page}
                    total={versionSurveyQuestion.total}
                    onChange={onChange}
                />
            </div>
        </div>
    );
}
