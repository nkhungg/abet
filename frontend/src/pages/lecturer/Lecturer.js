import React, { useState, useEffect } from "react";
import { Table, Input, Button, Pagination, } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import { FormattedMessage } from "react-intl";
import { ADD_INFO_COURSE_DRAWER, SET_EDIT_LECTURER, SET_IS_UPDATE_SUCCESS } from "../../redux/types";
import FormLecturer from "../../components/form-lecturer/FormLecturer";
import { getLecturersActionApi } from "../../actions/api-actions/ProgramAction";
import DropdownSort2 from "../../components/dropdown-sort/DropdownSort2";

export default function Lecturer() {
  const [isAscending, setAscending] = useState(true)
  const [defaultSort, setDefaultSort] = useState('id')
  const sortList = ['id', 'name', 'faculty', 'email', 'department', 'phoneNumber']
  const [searchedObj, setSearchedObj] = useState([])
  const [page, setPage] = useState(1);
  const { lecturers } = useSelector((state) => state.GeneralProgramReducer);
  const { isUpdateSuccess } = useSelector((state) => state.GeneralProgramReducer);

  useEffect(async () => {
    if (!isUpdateSuccess) return;
    setPage(1);
    setDefaultSort('id');
    setAscending(true);
  }, [isUpdateSuccess]);
  
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getLecturersActionApi(1, []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (page) => {
    setPage(page);
    dispatch(getLecturersActionApi(page, searchedObj));
  };

  const handleSearch = () => {
    dispatch(getLecturersActionApi(page, searchedObj));
  }

  const handleReset = (dataIndex, clearFilters) => {
    clearFilters();
    let searchedObjUpdate = searchedObj.filter(item => item.key !== dataIndex)
    setSearchedObj(searchedObjUpdate)
    dispatch(getLecturersActionApi(page, searchedObjUpdate));
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
    dispatch(getLecturersActionApi(1, [])) 
    setSearchedObj([])
    setPage(1)
    setDefaultSort('id')
    setAscending(true)
  }

  const data = lecturers?.data?.map((genPro, idx) => {
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
      title: "Lecturer Id",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      width: "150px",
      ...getColumnSearchProps("id"),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "250px",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Faculty",
      dataIndex: "faculty",
      key: "faculty",
      width: "250px",
      ...getColumnSearchProps("faculty"),
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "200px",
      key: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Department",
      dataIndex: "department",
      width: "150px",
      key: "department",
      ...getColumnSearchProps("department"),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      width: "150px",
      key: "phoneNumber",
      ...getColumnSearchProps("phoneNumber"),
    },
    {
      title: "Contract Level",
      dataIndex: "contactLevel",
      width: "150px",
      key: "contactLevel",
      ...getColumnSearchProps("contactLevel"),
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
                  title: "EDIT LECTURER",
                  Component: <FormLecturer />,
                };

                //dispatch lên reducer nội dung drawer
                dispatch(action1);
                //dispatch dữ liệu dòng hiện tai lên reducer
                const action2 = {
                  type: SET_EDIT_LECTURER,
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
        <FormattedMessage id="LECTURER" />
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
          <span
            onClick={() => {
              let action = {
                type: ADD_INFO_COURSE_DRAWER,
                title: "ADD NEW LECTURER",
                Component: <FormLecturer />,
              };
              dispatch(action);
              const action2 = {
                type: SET_EDIT_LECTURER,
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
          total={lecturers.total}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
