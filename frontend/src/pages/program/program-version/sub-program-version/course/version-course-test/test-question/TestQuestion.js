import React, { useEffect, useState } from "react";
import { Table, Input, Button, Pagination } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import {
  ADD_INFO_COURSE_DRAWER,
  SET_EDIT_VERSION_COURSE_INSTANCE_TEST_QUESTION,
  SET_EDIT_VERSION_COURSE_INSTANCE_TEST_QUESTION_OUTCOME,
} from "../../../../../../../redux/types";
import FormVersionCourseInstanceTestQuestion from "../../../../../../../components/form-version-course-instance-test-question/FormVersionCourseInstanceTestQuestion";
import FormVersionCourseInstanceTestQuestionOutcome from "../../../../../../../components/form-version-course-instance-test-question/FormVersionCourseInstanceTestQuestionOutcome";
import { getVersionCourseInstanceTestQuestionActionApi } from "../../../../../../../actions/api-actions/ProgramAction";
import parse from "react-html-parser";
import { SearchOutlined } from "@ant-design/icons";
import DropdownSort2 from "../../../../../../../components/dropdown-sort/DropdownSort2";

export default function TestQuestion() {
  const [isAscending, setAscending] = useState(true)
  const [page, setPage] = useState(1);
  const [defaultSort, setDefaultSort] = useState('name')
  const sortList = ['name', 'content', 'percent', 'maxScore']
  const [searchedObj, setSearchedObj] = useState([])
  const dispatch = useDispatch();
  const {
    selectedFlowProgramVersion,
    versionCourseIntanceTestQuestion,
  } = useSelector((state) => state.GeneralProgramReducer);

  const { testId } = selectedFlowProgramVersion;

  useEffect(() => {
    if(testId) {
      dispatch(getVersionCourseInstanceTestQuestionActionApi(testId, 1, []));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId]);

  const onChange = (page) => {
    setPage(page);
    if(testId) {
      dispatch(getVersionCourseInstanceTestQuestionActionApi(testId, page, []));
    }
  };

 const handleSearch = () => {
  if(testId) {
    dispatch(getVersionCourseInstanceTestQuestionActionApi(testId, page, searchedObj));
  }
  }
  
  const handleReset = (dataIndex, clearFilters) => {
    clearFilters();
    let searchedObjUpdate = searchedObj.filter(item => item.key !== dataIndex)
    setSearchedObj(searchedObjUpdate)
    if(testId) {
      dispatch(getVersionCourseInstanceTestQuestionActionApi(testId, page, searchedObjUpdate));
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
    if(testId) {
      dispatch(getVersionCourseInstanceTestQuestionActionApi(testId, 1, []));
    }
    setSearchedObj([])
    setDefaultSort('name')
    setAscending(true)
  }
  const expandedRowRender = (record) => {
    const columns = [
      {
        title: "Test Course outcome id",
        dataIndex: "courseOutcomeId",
        key: "courseOutcomeId",
        width: "200px",
        fixed: "left",
      },
      {
        title: "Name",
        dataIndex: "courseOutcomeName",
        key: "courseOutcomeName",
      },
      {
        title: "Comment",
        dataIndex: "comment",
        key: "comment",
      },
      {
        title: "Percent",
        dataIndex: "percent",
        key: "percent",
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
            style={{color: '#929292'}}
              onClick={() => {
                const action1 = {
                  type: ADD_INFO_COURSE_DRAWER,
                  title: "EDIT TEST QUESTION OUTCOME",
                  Component: <FormVersionCourseInstanceTestQuestionOutcome />,
                };

                //dispatch lên reducer nội dung drawer
                dispatch(action1);
                const action2 = {
                  type: SET_EDIT_VERSION_COURSE_INSTANCE_TEST_QUESTION_OUTCOME,
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

    const data = record?.outcomeList?.map((outcomeChild) => {
      return { ...outcomeChild, key: outcomeChild.id };
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
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "150px",
      fixed: "left",
      ...getColumnSearchProps("name"),

    },
    {
      title: "Content",
      key: "content",
      render: (record) => (
          <span>{parse(record.content)}</span>
      ),
      ...getColumnSearchProps("content"),

    },
    {
      title: "Percent",
      dataIndex: "percent",
      key: "percent",
      width: "100px",
      ...getColumnSearchProps("percent"),

    },
    {
      title: "File Attached",
      dataIndex: "attachFile",
      key: "attachFile",
      width: "200px",
    },
    {
      title: "Max score",
      dataIndex: "maxScore",
      key: "maxScore",
      width: "100px",
      ...getColumnSearchProps("maxScore"),

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
                title: "EDIT TEST QUESTION",
                Component: <FormVersionCourseInstanceTestQuestion />,
              };

              //dispatch lên reducer nội dung drawer
              dispatch(action1);
              const action2 = {
                type: SET_EDIT_VERSION_COURSE_INSTANCE_TEST_QUESTION,
                payload: { ...record, isEdit: true },
              };
              dispatch(action2);
              //dispatch dữ liệu dòng hiện tai lên reducer
            }}
            className="btn-edit mr-3"
            style={{color: '#929292'}}
          >
            <i className="fa fa-edit"></i>
          </span>
          <span
            onClick={() => {
              const action1 = {
                type: ADD_INFO_COURSE_DRAWER,
                title: "ADD NEW TEST QUESTION OUTCOME",
                Component: <FormVersionCourseInstanceTestQuestionOutcome />,
              };

              //dispatch lên reducer nội dung drawer
              dispatch(action1);
              const action2 = {
                type: SET_EDIT_VERSION_COURSE_INSTANCE_TEST_QUESTION_OUTCOME,
                payload: { questionId: record.id, isEdit: false },
              };
              dispatch(action2);
              //dispatch dữ liệu dòng hiện tai lên reducer
            }}
            className="btn-edit mr-3"
            style={{color: '#929292'}}
          >
            <i className="fa fa-plus-circle"></i>
          </span>
        </span>
      ),
      width: "80px",
      fixed: "right",
    },
  ];

  const data = versionCourseIntanceTestQuestion?.data?.map(
    (outcomeParent, idx) => {
      return { ...outcomeParent, key: idx + 1 };
    }
  );

  return (
    <div className="wrapper-outcome">
      <h5 className="mb-0">
        <FormattedMessage id="TEST_QUESTION" />
      </h5>

      <div className="mb-3 d-flex justify-content-end align-items-center">
        
        <div className="d-flex justify-content-center align-items-center wrapper-icon" style={{fontSize: '16px', color: '#66615b'}}>
        <DropdownSort2  
            isAscending={isAscending}
            updateAscending={updateAscending}
            defaultSort={defaultSort} 
            sortList={sortList} 
            updateSort={updateSortBy} 
            updateDefaultSort={updateDefaultCheck} 
          />
          <span className="icon" onClick={() => handleSearch()}><i className="fa fa-filter mx-3"></i></span>
          <span
            onClick={() => {
              let action = {
                type: ADD_INFO_COURSE_DRAWER,
                title: "ADD NEW TEST QUESTION",
                Component: <FormVersionCourseInstanceTestQuestion />,
              };
              dispatch(action);
              const action2 = {
                type: SET_EDIT_VERSION_COURSE_INSTANCE_TEST_QUESTION,
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
          <span title="Refresh page" onClick={() => clearAllSearch() }  className="icon mr-3">
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
      />
      <div className="d-flex justify-content-center my-3">
        <Pagination current={page} total={versionCourseIntanceTestQuestion.total} onChange={onChange} />
      </div>
    </div>
  );
}
