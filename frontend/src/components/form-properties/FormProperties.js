import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getAttributeActionApi } from '../../actions/api-actions/AttributeAction'
import './FormProperties.scss'

export default function FormProperties() {
    const dispatch = useDispatch()
    const { atrrList } = useSelector((state) => state.AttributeReducer);

    const [ selectedAttr, setSelectedAttr ] = useState({})
    const [ optionList, setOptionList ] = useState([])

    useEffect(() => {
        dispatch(getAttributeActionApi())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const editAtrribute = (attr) => {
        setSelectedAttr(attr)
    }

    const renderAttrList = () => {
        return atrrList?.data?.map((attr, idx) => {
            return <div key={idx} className='wrapper-attr mb-4 px-4 py-2 d-flex justify-content-between'>
            <span>{ attr.name }</span>
            <div className='wrapper-icon'>
                <span onClick={() => editAtrribute(attr)} className='icon mr-3'><i className="fa fa-pencil-alt"></i></span>
                <span className='icon'><i className="fa fa-minus-circle"></i></span>
            </div>
        </div>
        })
    }

    const renderNewOptionList = () => {
        return optionList?.map((opt, idx) => {
            return <div className='col-12' key={idx}>
            <div className="form-group">
                <input 
                    name={`value${idx+1}`}
                    placeholder={`Please enter value`}
                   id="attribute" 
                   className="form-control"     
                   type="text" 
               />
            </div>
           </div>
        })
    }

    const renderEditAttrList = () => {
        return selectedAttr?.attrOptionList?.map((value, idx) => {
            return <div key={idx} className='wrapper-edit-attr mb-4 mx-3 px-4 py-2 d-flex justify-content-between'>
            <span>{ value.name }</span>
            <div className='wrapper-icon'>
                <span className='icon'><i className="fa fa-minus-circle"></i></span>
            </div>
        </div>
        })
    }

    const addAttribute = () => {
        let optionListUpdate = [...optionList, '']
        setOptionList(optionListUpdate)
    }

    return (
        <div className='form-properties'>
            <div className='wrapper-all-attr mb-4'>
                <p className='text-center font-weight-bold text-primary mb-4'>Attributes</p>
                { renderAttrList() }
            </div>
            <div>
                <p className='text-center font-weight-bold text-primary'>Add attribute</p>


                {
                    Object.keys(selectedAttr).length > 0 ? 
                   ( 
                       <div>
                       <div className='col-12'>
                        <div className="form-group">
                            <label htmlFor="attribute">Attribute: </label>
                            <input 
                                value={selectedAttr.name}
                              
                                id="attribute" 
                                className="form-control" 
                                type="text" 
                            />
                        </div>
                    </div>
                    { renderEditAttrList() } 
                       </div>
                    ) : 
                    (  <div className='col-12'>
                        <div className="form-group">
                            <label htmlFor="attribute">Attribute: </label>
                            <input 
                                id="attribute" 
                                className="form-control" 
                                type="text" 
                            />
                        </div>
                        </div>
                    )
                }
                
                {/* 3 - COMMON ADD MORE VALUE */}

                { renderNewOptionList() }

                <div className='d-flex justify-content-center'>
                <span onClick={() => addAttribute()} className='px-4 py-2'><i className="mr-2 fa fa-plus"></i>Add</span>
                </div>

            </div>
        </div>
    )
}
