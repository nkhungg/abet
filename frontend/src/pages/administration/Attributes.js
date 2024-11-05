import React, { useState, useEffect } from "react";
import { Table, Input, Pagination } from "antd";
import { useDispatch, useSelector } from "react-redux";
import actions from "../../asset/images/actions.png";
import { getAttributeActionApi } from "../../actions/api-actions/AttributeAction";
import { ADD_INFO_COURSE_DRAWER } from "../../redux/types";
import FormProperties from '../../components/form-properties/FormProperties'
const { Search } = Input;

export default function Attributes() {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const { atrrList } = useSelector((state) => state.AttributeReducer);

  useEffect(() => {
    dispatch(getAttributeActionApi(page, ''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (page) => {
    setPage(page);
    dispatch(getAttributeActionApi(page, ''));
  };

  const onSearch = (value) => console.log(value);

  const data = atrrList?.data?.map((attr, idx) => {
    return {
      ...attr,
      key: (page - 1) * 10 + idx + 1,
    };
  });

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      width: "5%",
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "10%",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "25%",
      sorter: (a, b) => a.length - b.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Category",
      dataIndex: "tableName",
      key: "tableName",
      sorter: (a, b) => a.length - b.length,
      sortDirections: ["descend", "ascend"],
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
                  title: 'EDIT ATTRIBUTE',
                  Component: <FormProperties />
                }

                //dispatch lên reducer nội dung drawer
                dispatch(action1);     

                console.log('RECORD', record)           
            }}
          >     
          <i className="fa fa-edit"></i>
        </span>
        <img className='mt-1 actions' src={actions} alt='action' width='20' height='20'/>
        </span>
    },
    },
  ];

  return (
    <div className="mt-2 general-course">
    <h5>General attribute</h5>
    <div className='my-3 d-flex justify-content-between align-items-center'>
    <Search placeholder="input search text" allowClear onSearch={onSearch} />
      <div className='wrapper-icon'>
        <span
            onClick={() => {
              let action = {
                  type: ADD_INFO_COURSE_DRAWER,
                  title: 'ADD ATTRIBUTE',
                  Component: <FormProperties />
              }
              dispatch(action)
            }}
            className='icon mr-3'><i className="fa fa-plus"></i></span>
        <span className='icon mr-3'>
        <i className="fa fa-columns"></i>
        </span>
        <span className='icon mr-3'>
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
      total={atrrList.total}
      onChange={onChange}
    />
  </div>
</div>
  );
}
