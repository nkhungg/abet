import React, { useState, useEffect } from "react";
import { Table, Input, Button, Pagination } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import { FormattedMessage } from "react-intl";
import {
  ADD_INFO_COURSE_DRAWER,
  SET_EDIT_VERSION_CLASS_ASSESSMENT,
} from "../../../../../../../redux/types";
import FormVersionClassAssessment from "../../../../../../../components/form-version-class-assessment/FormVersionClassAssessment";
import { getVersionClassAssessmentActionApi } from "../../../../../../../actions/api-actions/ProgramAction";
import DropdownSort2 from "../../../../../../../components/dropdown-sort/DropdownSort2";

export default function ClassAssessment() {
  const [isAscending, setAscending] = useState(true)
  const [defaultSort, setDefaultSort] = useState('courseOutcomeInstanceId')
  const sortList = ['courseOutcomeInstanceId', 'description', 'cdio', 'threshold', 'classThreshold']
  const [searchedObj, setSearchedObj] = useState([])
  const [page, setPage] = useState(1);
  const { selectedFlowProgramVersion, versionClassAssessment } = useSelector(
    (state) => state.GeneralProgramReducer
  );

  const { classId } = selectedFlowProgramVersion;

  const dispatch = useDispatch();
  useEffect(() => {
    if(classId) {
      dispatch(getVersionClassAssessmentActionApi(classId, 1, []));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  const onChange = (page) => {
    setPage(page);
    if(classId) {
      dispatch(getVersionClassAssessmentActionApi(classId, page, searchedObj));
    }
  };

  const handleSearch = () => {
    if(classId) {
      dispatch(getVersionClassAssessmentActionApi(classId, page, searchedObj));
    }
  }

  const handleReset = (dataIndex, clearFilters) => {
    clearFilters();
    let searchedObjUpdate = searchedObj.filter(item => item.key !== dataIndex)
    setSearchedObj(searchedObjUpdate)
    if(classId) {
      dispatch(getVersionClassAssessmentActionApi(classId, page, searchedObjUpdate));
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
    if(classId) {
      dispatch(getVersionClassAssessmentActionApi(classId, 1, []));
    }
    setSearchedObj([])
    setDefaultSort('courseOutcomeInstanceId')
    setAscending(true)
  }

  const data = versionClassAssessment?.data?.map((genPro, idx) => {
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
      width: "120px",
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
    title: "Class Threshold",
    dataIndex: "classThreshold",
    width: "130px",
    key: "classThreshold",
    ...getColumnSearchProps("classThreshold"),
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
                  title: "EDIT CLASS ACCESSMENT",
                  Component: <FormVersionClassAssessment />,
                };

                //dispatch lên reducer nội dung drawer
                dispatch(action1);
                //dispatch dữ liệu dòng hiện tai lên reducer
                const action2 = {
                  type: SET_EDIT_VERSION_CLASS_ASSESSMENT,
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
      <h5>
        <FormattedMessage id="ACCESSMENT" />
      </h5>

      <div className="my-3 d-flex justify-content-end align-items-center">
       
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
          <span onClick={() => clearAllSearch()} className="icon mr-3">
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
          total={versionClassAssessment.total}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
