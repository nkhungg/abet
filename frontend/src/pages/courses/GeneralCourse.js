import React, { useState, useEffect } from "react";
import { Table, Input, Button, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getCourseListActionApi } from "../../actions/api-actions/CourseAction";
import { ADD_INFO_COURSE_DRAWER, EDIT_COURSE } from "../../redux/types";
import './GeneralCourse.scss'
import FormCourse from "../../components/form-create-course/FormCourse";
import { FormattedMessage } from 'react-intl';
import DropdownSort2 from "../../components/dropdown-sort/DropdownSort2";

export default function GeneralCourse() {
  const [isAscending, setAscending] = useState(true)
  const [defaultSort, setDefaultSort] = useState('id')
  const sortList = ['id', 'name', 'groups', 'description']
  const [searchedObj, setSearchedObj] = useState([])
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCourseListActionApi(1, []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { courseList } = useSelector((state) => state.CourseReducer);
  const { isUpdateSuccess } = useSelector((state) => state.GeneralProgramReducer);
  
  useEffect(async () => {
    if (!isUpdateSuccess) return;
    setPage(1);
    setDefaultSort('id');
    setAscending(true);
  }, [isUpdateSuccess]);

  const onChange = page => {
    setPage(page)
    dispatch(getCourseListActionApi(page, searchedObj))
  }

  const handleSearch = () => {
    dispatch(getCourseListActionApi(page, searchedObj));
  }

  const handleReset = (dataIndex, clearFilters) => {
    clearFilters();
    let searchedObjUpdate = searchedObj.filter(item => item.key !== dataIndex)
    setSearchedObj(searchedObjUpdate)
    dispatch(getCourseListActionApi(page, searchedObjUpdate));
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
    dispatch(getCourseListActionApi(page, []))
    setSearchedObj([])
    setPage(1)
    setDefaultSort('id')
    setAscending(true)
  }

  const data = courseList?.data?.map((course, idx) => {
    return {
      ...course,
      key: (page - 1) * 10 + idx + 1,
    };
  });

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      width: "60px",
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "7%",
      ...getColumnSearchProps("id"),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "22%",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Groups",
      dataIndex: "groups",
      key: "groups",
      width: "10%",
      ...getColumnSearchProps("groups"),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ...getColumnSearchProps("description"),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "60px",
      render: (text, record, index) => {
        return <span className='d-flex justify-content-between align-items-center'>
          <span className='btn-edit mr-3'
            onClick={() => {
              const action1 = {
                type: ADD_INFO_COURSE_DRAWER,
                title: 'EDIT COURSE',
                Component: <FormCourse />,
              }

              //dispatch lên reducer nội dung drawer
              dispatch(action1);
              //dispatch dữ liệu dòng hiện tai lên reducer
              const action2 = {
                type: EDIT_COURSE,
                payload: record
              }
              dispatch(action2);
            }}
          >
            <i className="fa fa-edit"></i>
          </span>
        </span>
      },
    },
  ];

  return (
    <div className="mt-2 general-course">
      <h5><FormattedMessage id='GENERAL_COURSE' /></h5>

      <div className='my-3 d-flex justify-content-end align-items-center'>

        <div className='d-flex justify-content-center align-items-center wrapper-icon'>
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
                title: 'ADD NEW COURSE',
                Component: <FormCourse />
              }
              dispatch(action)
              const action2 = {
                type: EDIT_COURSE,
                payload: {}
              }
              dispatch(action2);
            }}
            className='icon mr-3'><i className="fa fa-plus"></i></span>
          {/* <span className='icon mr-3'>
            <i className="fa fa-columns"></i>
          </span> */}
          <span title="Refresh page" onClick={() => clearAllSearch() } className='icon mr-3'>
            <i className="fa fa-sync-alt"></i>
          </span>
          <span className='icon mr-3'>
            <i className="fa fa-download"></i>
          </span>
        </div>
      </div>
      <Table
        pagination={false}
        columns={columns}
        dataSource={data}
      />

      <div className="d-flex justify-content-center my-3">
        <Pagination
          current={page}
          total={courseList.total}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
