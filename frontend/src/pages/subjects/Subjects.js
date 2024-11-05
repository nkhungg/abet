import { Button, Input, Pagination, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { getSubjectsSideBarActionApi } from '../../actions/api-actions/ProgramAction';
import FormSubjectSidebar from '../../components/form-subject-sidebar/FormSubjectSidebar';
import { ADD_INFO_COURSE_DRAWER, SET_EDIT_ALL_SUBJECT_SIDEBAR } from '../../redux/types';
import { SearchOutlined } from '@ant-design/icons'
import DropdownSort2 from '../../components/dropdown-sort/DropdownSort2';

export default function Subjects() {
  const [isAscending, setAscending] = useState(true)
  const [defaultSort, setDefaultSort] = useState('name')
  const sortList = ['name']
  const [searchedObj, setSearchedObj] = useState([])
  const [page, setPage] = useState(1);
  const { isUpdateSuccess } = useSelector((state) => state.GeneralProgramReducer);

  useEffect(async () => {
    if (!isUpdateSuccess) return;
    setPage(1);
    setDefaultSort('name');
    setAscending(true);
  }, [isUpdateSuccess]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSubjectsSideBarActionApi(1, []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { allSubjectsSidebar } = useSelector(
    (state) => state.GeneralProgramReducer
  );


  const handleSearch = () => {
    dispatch(getSubjectsSideBarActionApi(1, searchedObj));
  }

  const handleReset = (dataIndex, clearFilters) => {
    clearFilters();
    let searchedObjUpdate = searchedObj.filter(item => item.key !== dataIndex)
    setSearchedObj(searchedObjUpdate)
    dispatch(getSubjectsSideBarActionApi(page, searchedObjUpdate));
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

  const data = allSubjectsSidebar?.data?.map((genPro, idx) => {
    return {
      ...genPro,
      key: (page - 1) * 10 + idx + 1,
    };
  });

  const onChange = (page) => {
    setPage(page);
    dispatch(getSubjectsSideBarActionApi(page, searchedObj));
  }

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      width: "60px",
      fixed: 'left',
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: 'right',
      width: "80px",
      render: (text, record, index) => {
        return (
          <span className="d-flex justify-content-between align-items-center">
            <span
              className="btn-edit mr-3"
              onClick={() => {
                const action1 = {
                  type: ADD_INFO_COURSE_DRAWER,
                  title: "EDIT SUBJECT",
                  Component: <FormSubjectSidebar />,
                };

                //dispatch lên reducer nội dung drawer
                dispatch(action1);
                //dispatch dữ liệu dòng hiện tai lên reducer
                const action2 = {
                  type: SET_EDIT_ALL_SUBJECT_SIDEBAR,
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
  const updateSearchObj = (dataIndex, val, searchedObjUpdate) => {
    if(!val) return searchedObjUpdate
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
    dispatch(getSubjectsSideBarActionApi(1, []));
    setSearchedObj([])
    setPage(1)
    setDefaultSort('name')
    setAscending(true)
  }

  return (
    <div className="mt-2 general-program">
      <h5 className='mb-0'>
        <FormattedMessage id="SUBJECTS" />
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
                title: "ADD NEW SUBJECT",
                Component: <FormSubjectSidebar />,
              };
              dispatch(action);
              const action2 = {
                type: SET_EDIT_ALL_SUBJECT_SIDEBAR,
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
          <span title='Refresh page' onClick={() => clearAllSearch() } className="icon mr-3">
            <i className="fa fa-sync-alt"></i>
          </span>
          <span className="icon mr-3">
            <i className="fa fa-download"></i>
          </span>
          
        </div>
      </div>
      <Table scroll={{ x: 992 }} pagination={false} columns={columns} dataSource={data} />

      <div className="d-flex justify-content-center my-3">
        <Pagination
          current={page}
          total={allSubjectsSidebar.total}
          onChange={onChange}
        />
      </div>
    </div>
  )
}
