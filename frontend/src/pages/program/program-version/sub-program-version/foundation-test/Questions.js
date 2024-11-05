import React, { useEffect, useState } from "react";
import { Table, Input, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { getVersionFoundationTestQuestionActionApi } from "../../../../../actions/api-actions/ProgramAction";
import { ADD_INFO_COURSE_DRAWER, SET_EDIT_VERSION_FOUNDATION_TEST_QUESTIONS, SET_EDIT_VERSION_FOUNDATION_TEST_QUESTIONS_ANSWER } from "../../../../../redux/types";
import parse from "react-html-parser";
import FormVersionFoundationTestQuestion from "../../../../../components/form-version-foundation-test-question/FormVersionFoundationTestQuestion";
import FormVersionFoundationTestQuestionAnswer from "../../../../../components/form-version-foundation-test-question-answer/FormVersionFoundationTestQuestionAnswer";
import { SearchOutlined } from "@ant-design/icons";
import DropdownSort2 from "../../../../../components/dropdown-sort/DropdownSort2";

export default function Question() {
    const [isAscending, setAscending] = useState(true)
    const [defaultSort, setDefaultSort] = useState('name')
    const sortList = ['name', 'content', 'outcomeName', 'subjectName', 'lecturerName', 'level', 'percent', 'time']
    const [searchedObj, setSearchedObj] = useState([])
    const dispatch = useDispatch();
    const {
        selectedFlowProgramVersion,
        versionFoundationTestQuestions,
    } = useSelector((state) => state.GeneralProgramReducer);

    const { programVersionInfo } = selectedFlowProgramVersion;

    useEffect(() => {
        if (programVersionInfo) {
            dispatch(getVersionFoundationTestQuestionActionApi(programVersionInfo, 1, 1000, []));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [programVersionInfo]);

    const expandedRowRender = (record) => {
        const columns = [
            {
                title: "Answer",
                dataIndex: "answerId",
                key: "answerId",
                width: "100px",
                fixed: "left",
            },
            {
                title: "Description",
                key: "description",
                render: (record) => (
                    <span>{parse(record.description)}</span>
                )
            },
            {
                title: "Image",
                key: "image",
                width: "200px",
                render: (text, record, index) => (
                    <img src={record.image} alt={record.image} />
                )
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
                                    Component: <FormVersionFoundationTestQuestionAnswer />,
                                };

                                //dispatch lên reducer nội dung drawer
                                dispatch(action1);
                                const action2 = {
                                    type: SET_EDIT_VERSION_FOUNDATION_TEST_QUESTIONS_ANSWER,
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
            return { ...item, key: `${item.levelId}-${idx}` };
        });

        return <Table className="child-test-question" columns={columns} dataSource={data} pagination={false} />;
    };

    const handleSearch = () => {
        if (programVersionInfo) {
            dispatch(getVersionFoundationTestQuestionActionApi(programVersionInfo, 1, 1000, searchedObj));
        }
    }

    const handleReset = (dataIndex, clearFilters) => {
        clearFilters();
        let searchedObjUpdate = searchedObj.filter(item => item.key !== dataIndex)
        setSearchedObj(searchedObjUpdate)
        if (programVersionInfo) {
            dispatch(getVersionFoundationTestQuestionActionApi(programVersionInfo, 1, 1000, searchedObjUpdate));
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
        if (programVersionInfo) {
            dispatch(getVersionFoundationTestQuestionActionApi(programVersionInfo, 1, 1000, []));
        }
        setSearchedObj([])
        setDefaultSort('name')
        setAscending(true)
    }

    const columns = [
        {
            title: "STT",
            dataIndex: "key",
            key: "key",
            fixed: "left",
            width: "60px",
        },
        {
            title: "Question",
            dataIndex: "name",
            key: "name",
            width: "100px",
            fixed: "left",
            ...getColumnSearchProps("name"),
        },
        {
            title: "Content",
            key: "content",
            width: "300px",
            fixed: "left",
            render: (record) => (
                <span>{parse(record.content)}</span>
            ),
            ...getColumnSearchProps("content"),
        },
        {
            title: "Outcome",
            dataIndex: "outcomeName",
            key: "outcomeName",
            width: "90px",
            ...getColumnSearchProps("outcomeName"),
        },
        {
            title: "Subject",
            dataIndex: "subjectName",
            key: "subjectName",
            width: "100px",
            ...getColumnSearchProps("subjectName"),

        },
        {
            title: "Lecturer",
            dataIndex: "lecturerName",
            key: "lecturerName",
            width: "150px",
            ...getColumnSearchProps("lecturerName"),

        },
        {
            title: "Level",
            dataIndex: "level",
            key: "level",
            width: "100px",
            ...getColumnSearchProps("level"),
        },
        {
            title: "Expectation (%)",
            dataIndex: "percent",
            key: "percent",
            width: "100px",
            ...getColumnSearchProps("percent"),
        },
        {
            title: "Time (s)",
            dataIndex: "time",
            key: "time",
            width: "100px",
            ...getColumnSearchProps("time"),
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
                                title: "EDIT QUESTION",
                                Component: <FormVersionFoundationTestQuestion />,
                            };

                            //dispatch lên reducer nội dung drawer
                            dispatch(action1);
                            const action2 = {
                                type: SET_EDIT_VERSION_FOUNDATION_TEST_QUESTIONS,
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
                                Component: <FormVersionFoundationTestQuestionAnswer />,
                            };

                            //dispatch lên reducer nội dung drawer
                            dispatch(action1);
                            const action2 = {
                                type: SET_EDIT_VERSION_FOUNDATION_TEST_QUESTIONS_ANSWER,
                                payload: { questionId: record.id, isEdit: false },
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

    const data = versionFoundationTestQuestions?.data?.map(
        (question, idx) => {
            return { ...question, key: + idx + 1 };
        }
    );

    return (
        <div className="wrapper-outcome">
            

            <div className="mb-3 d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
                <FormattedMessage id="QUESTION" />
            </h5>
                <div className="d-flex justify-content-center align-items-center wrapper-icon" style={{ fontSize: '16px', color: '#66615b' }}>
                <DropdownSort2  
            isAscending={isAscending}
            updateAscending={updateAscending}
            defaultSort={defaultSort} 
            sortList={sortList} 
            updateSort={updateSortBy} 
            updateDefaultSort={updateDefaultCheck} 
          />
          <span className="icon" onClick={() => handleSearch()}><i className="fa fa-filter mx-3"></i></span>
                    <a style={{ color: 'rgb(102, 97, 91)' }} target="_blank" href={`/program-version/${programVersionInfo}/foundation-test/question-content`} className="icon mr-3"><i className="fa fa-eye"></i></a>
                    <span
                        onClick={() => {
                            let action = {
                                type: ADD_INFO_COURSE_DRAWER,
                                title: "ADD NEW QUESTION",
                                Component: <FormVersionFoundationTestQuestion />,
                                width: 600,
                            };
                            dispatch(action);
                            const action2 = {
                                type: SET_EDIT_VERSION_FOUNDATION_TEST_QUESTIONS,
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
                    <span className="icon mr-3">
                        <i className="fa fa-download"></i>
                    </span>
                  
                </div>
            </div>
            <Table
                scroll={{ x: 992 }}
                className="components-table-demo-nested"
                columns={columns}
                expandable={{ expandedRowRender }}
                dataSource={data}
                pagination={{ pageSize: 1000 }}
            />
        </div>
    );
}
