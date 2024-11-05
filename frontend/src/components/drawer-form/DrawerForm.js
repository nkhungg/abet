import React, { useEffect } from 'react'
import { Drawer } from 'antd';
import {useSelector, useDispatch} from 'react-redux'
import { CLOSE_FORM_COURSE_DRAWER, SET_IS_UPDATE_SUCCESS } from '../../redux/types';

export default function DrawerComp() {

    const { visible, ComponentContentDrawer, title, width } = useSelector(state => state.DrawerCourseReducer);

    useEffect(() => {
      if (visible) {
        dispatch({
          type: SET_IS_UPDATE_SUCCESS,
          payload: false,
        })
      }
    }, [visible]);
    
    const dispatch = useDispatch()
    
    const onClose = () => {
        dispatch({type: CLOSE_FORM_COURSE_DRAWER})
    };

    return (
        <>
        <Drawer
          title={title}
          width={width}
          onClose={onClose}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
           {visible ? ComponentContentDrawer : null} 
        </Drawer>
      </>
    )
}
