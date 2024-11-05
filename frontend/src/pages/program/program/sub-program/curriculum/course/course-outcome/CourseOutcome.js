import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Input, Button, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FormattedMessage } from "react-intl";
import { getCourseOutcomeActionApi } from "../../../../../../../actions/api-actions/ProgramAction";
import { ADD_INFO_COURSE_DRAWER, SET_EDIT_COURSE_OUTCOME } from "../../../../../../../redux/types";
import FormCourseOutcome from "../../../../../../../components/form-course-outcome/FormCourseOutcome";
import { Typography } from 'antd';
import DropdownSort2 from "../../../../../../../components/dropdown-sort/DropdownSort2";

const { Paragraph } = Typography;

export default function CourseOutcome() {
  const [isAscending, setAscending] = useState(true)
  const [defaultSort, setDefaultSort] = useState('name')
  const sortList = ['name', 'description', 'cdio', 'indicatorName', 'percentIndicator', 'parentId']
  const [searchedObj, setSearchedObj] = useState([])
  const [page, setPage] = useState(1);
  const { courseOutcome, selectedFolw } = useSelector(
    (state) => state.GeneralProgramReducer
  );
  const { programId, cirCourseId } = selectedFolw

  const { isUpdateSuccess } = useSelector((state) => state.GeneralProgramReducer);
  
  useEffect(async () => {
    if (!isUpdateSuccess) return;
    setPage(1);
    setDefaultSort('name');
    setAscending(true);
  }, [isUpdateSuccess]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (programId && cirCourseId) {
      dispatch(getCourseOutcomeActionApi(programId, cirCourseId, 1, []));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cirCourseId]);

  const onChange = (page) => {
    setPage(page)
    if (programId && cirCourseId) {
      dispatch(getCourseOutcomeActionApi(programId, cirCourseId, page, searchedObj));
    }
  };

  const handleSearch = () => {
    if (programId && cirCourseId) {
      dispatch(getCourseOutcomeActionApi(programId, cirCourseId, page, searchedObj));
    }
  }

  const handleReset = (dataIndex, clearFilters) => {
    clearFilters();
    let searchedObjUpdate = searchedObj.filter(item => item.key !== dataIndex)
    setSearchedObj(searchedObjUpdate)
    if (programId && cirCourseId) {
      dispatch(getCourseOutcomeActionApi(programId, cirCourseId, page, searchedObjUpdate));
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
    if (programId && cirCourseId) {
      dispatch(getCourseOutcomeActionApi(programId, cirCourseId, page, []));
    }
    setSearchedObj([])
    setPage(1)
    setDefaultSort('name')
    setAscending(true)
  }

  const data = courseOutcome?.data?.map((courseOutcome, idx) => {
    return {
      ...courseOutcome,
      key: (page - 1) * 10 + idx + 1,
      programId: programId,
    };
  });

  const columns = [
    {
      title: "Stt",
      dataIndex: "key",
      key: "key",
      width: "60px",
      fixed: 'left',
    },
    {
      title: "Outcome Name",
      dataIndex: "name",
      key: "name",
      width: '150px',
      ...getColumnSearchProps("name"),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ...getColumnSearchProps("description"),
      render: text => <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }} >{text}</Paragraph>,
    },
    {
      title: "CDIO",
      dataIndex: "cdio",
      key: "cdio",
      width: '80px',
      ...getColumnSearchProps("cdio"),
    },
    {
      title: "Indicator Name",
      dataIndex: "indicatorName",
      key: "indicatorName",
      width: '100px',
      ...getColumnSearchProps("indicatorName"),
    },
    {
      title: "Percent Indicator",
      dataIndex: "percentIndicator",
      key: "percentIndicator",
      width: '100px',
      ...getColumnSearchProps("percentIndicator"),
    },
    {
      title: "Parent Id",
      dataIndex: "parentId",
      key: "parentId",
      width: '100px',
      ...getColumnSearchProps("parentId"),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "60px",
      fixed: 'right',
      render: (text, record, index) => {
        return (
          <span className="d-flex justify-content-center align-items-center">
            <span
              className="btn-edit mr-3"
              onClick={() => {
                const action1 = {
                  type: ADD_INFO_COURSE_DRAWER,
                  title: "EDIT COURSE OUTCOME",
                  Component: <FormCourseOutcome />,
                };

                //dispatch lên reducer nội dung drawer
                dispatch(action1);
                //dispatch dữ liệu dòng hiện tai lên reducer
                const action2 = {
                  type: SET_EDIT_COURSE_OUTCOME,
                  payload: { ...record, isEdit: true },
                };
                dispatch(action2);
              }}
            >
              <i className="fa fa-edit"></i>
            </span>
          </span>
        );
      },
    },
  ];

  return (
    <div className="mt-2 outcomes">
      <div className="d-flex justify-content-start align-items-center">
        <h5 className="mb-0 mr-5">
          <FormattedMessage id="OUTCOME" />
        </h5>
      </div>

      <div className="mb-3 d-flex justify-content-end align-items-center">

        <div className="d-flex justify-content-center align-items-center wrapper-icon">
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
                title: "ADD NEW COURSE OUTCOME",
                Component: <FormCourseOutcome />,
              };
              dispatch(action);
              const action2 = {
                type: SET_EDIT_COURSE_OUTCOME,
                payload: {
                  isEdit: false,
                },
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
        pagination={false} columns={columns} dataSource={data} />

      <div className="d-flex justify-content-center my-3">
        <Pagination
          current={page}
          total={courseOutcome.total}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
