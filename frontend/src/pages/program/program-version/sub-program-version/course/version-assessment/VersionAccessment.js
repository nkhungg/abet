import React, { useState, useEffect } from "react";
import { Table, Input, Button, Pagination, } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import { FormattedMessage } from "react-intl";
import {
  ADD_INFO_COURSE_DRAWER,
  SET_EDIT_COURSE_ACCESSMENT,
} from "../../../../../../redux/types";
import { getCourseOutcomesInCourseInstanceActionApi } from "../../../../../../actions/api-actions/ProgramAction";
import FormVersionAccessment from "../../../../../../components/form-version-assessment/FormVersionAccessment";
import DropdownSort2 from "../../../../../../components/dropdown-sort/DropdownSort2";

const PAGE_SIZE = 10

export default function VersionAccessment() {
  const [isAscending, setAscending] = useState(true)
  const [defaultSort, setDefaultSort] = useState('name')
  const sortList = ['name', 'description', 'cdio', 'threshold']
  const [searchedObj, setSearchedObj] = useState([])
  const [page, setPage] = useState(1);
  const {
    selectedFlowProgramVersion,
    courseOutcomesFromCourseInstance,
  } = useSelector((state) => state.GeneralProgramReducer);

  const { programVersionInfo, courseId } = selectedFlowProgramVersion;
  const dispatch = useDispatch();

  useEffect(() => {
    if(programVersionInfo && courseId) {
      dispatch(getCourseOutcomesInCourseInstanceActionApi(programVersionInfo, courseId, 1, PAGE_SIZE, []));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programVersionInfo, courseId]);

  const onChange = (page) => {
    setPage(page);
    if(programVersionInfo && courseId) {
      dispatch(getCourseOutcomesInCourseInstanceActionApi(programVersionInfo, courseId, page, PAGE_SIZE, searchedObj));
    }
  };

  const handleSearch = () => {
    if(programVersionInfo && courseId) {
      dispatch(getCourseOutcomesInCourseInstanceActionApi(programVersionInfo, courseId, page, PAGE_SIZE, searchedObj));
    }
  }

  const handleReset = (dataIndex, clearFilters) => {
    clearFilters();
    let searchedObjUpdate = searchedObj.filter(item => item.key !== dataIndex)
    setSearchedObj(searchedObjUpdate)
    
    if(programVersionInfo && courseId) {
      dispatch(getCourseOutcomesInCourseInstanceActionApi(programVersionInfo, courseId, page, PAGE_SIZE, searchedObjUpdate));
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
    setPage(1)
    if(programVersionInfo && courseId) {
      dispatch(getCourseOutcomesInCourseInstanceActionApi(programVersionInfo, courseId, 1 , PAGE_SIZE, []));
    }
    setSearchedObj([])
    setDefaultSort('name')
    setAscending(true)
  }

  const data = courseOutcomesFromCourseInstance?.data?.map((genPro, idx) => {
    return {
      ...genPro,
      key: (page - 1) * 10 + idx + 1,
    };
  });

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
      fixed: "left",
      width: "100px",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ...getColumnSearchProps("description"),
    },
    {
      title: "CDIO",
      dataIndex: "cdio",
      key: "cdio",
      width: "100px",
      ...getColumnSearchProps("cdio"),
    },
    {
      title: "Threshold",
      dataIndex: "threshold",
      width: "130px",
      key: "threshold",
      ...getColumnSearchProps("threshold"),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: "80px",
      render: (text, record, index) => {
        return (
          <span className="d-flex justify-content-center align-items-center">
            <span
              className="btn-edit mr-3"
              onClick={() => {
                const action1 = {
                  type: ADD_INFO_COURSE_DRAWER,
                  title: "EDIT ACCESSMENT",
                  Component: <FormVersionAccessment />,
                };

                //dispatch lên reducer nội dung drawer
                dispatch(action1);
                //dispatch dữ liệu dòng hiện tai lên reducer
                const action2 = {
                  type: SET_EDIT_COURSE_ACCESSMENT,
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
    <div className="mt-2 general-program">
      <h5 className="mb-0">
        <FormattedMessage id="ACCESSMENT" />
      </h5>

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
          {/* <span className="icon mr-3">
            <i className="fa fa-columns"></i>
          </span> */}
          <span title="Refresh page" onClick={() => clearAllSearch() } className="icon mr-3">
            <i className="fa fa-sync-alt"></i>
          </span>
          <span className="icon mr-3">
            <i className="fa fa-download"></i>
          </span>
          
        </div>
      </div>
      <Table
        scroll={{ x: 992 }}
        pagination={false}
        columns={columns}
        dataSource={data}
      />

      <div className="d-flex justify-content-center my-3">
        <Pagination
          current={page}
          total={courseOutcomesFromCourseInstance.total}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
