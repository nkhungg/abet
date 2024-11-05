import React, {useState} from 'react'
import logo from '../../asset/images/image 1.png'
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Dropdown, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import enFlag from '../../asset/images/en1.png'
import vnFlag from '../../asset/images/vn.png'
import admin from '../../asset/images/iconadmin.png'
import company from '../../asset/images/company.png'
import user from '../../asset/images/profileuser.png'
import logout from '../../asset/images/logout1.png'
import { ACCESSTOKEN } from '../../util/SettingSystem';
import {history} from '../../App'
import { NavLink } from 'react-router-dom';
import { SET_SELECTED_SIDEBAR, TRANSLATE_LANGUAGE } from '../../redux/types';
import { FormattedMessage } from 'react-intl';
import './Header.scss'

export default function Header() {
  const { userLogin } = useSelector(state => state.UserReducer)
  const { lang } = useSelector(state => state.UserReducer)
  const dispatch = useDispatch()
  const [language, setLanguage] = useState(lang === 'en' ? enFlag : vnFlag)

  const handleLogout = () => {
    localStorage.removeItem(ACCESSTOKEN)
    history.push('/login')
  }

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <img className='mr-4' src={admin} alt='adminrole' width='20' height='20'/>
        <span className='text-uppercase border border-warning text-warning px-2'>{ userLogin?.role }</span>
      </Menu.Item>
      <Menu.Item 
        key="2"
        onClick={() => {
          history.push('/company-profile')
          dispatch({type: SET_SELECTED_SIDEBAR})
        }}  
      >
        <img className='mr-4' src={company} alt='company' width='20' height='20' />
        <span><FormattedMessage id='COMPANY_PROFILE' /></span>
      </Menu.Item>
      <Menu.Item 
        key="3"
        onClick={() => {
          history.push('/user-profile')
          dispatch({type: SET_SELECTED_SIDEBAR})
        }}
      >
        <img className='mr-4' src={user} alt='user' width='20' height='20' />
        <span><FormattedMessage id='USER_PROFILE' /></span>
      </Menu.Item>
      <Menu.Item onClick={() => handleLogout()} key="4">
        <img className='mr-4' src={logout} alt='logout' width='20' height='20' />
        <span><FormattedMessage id='LOGOUT' /></span>
      </Menu.Item>
    </Menu>
  );

  const setLanguageAll = (lang, bool) => {
    setLanguage(lang)
    dispatch({
      type: TRANSLATE_LANGUAGE,
      payload: bool ? 'en' : 'vi'
    })
  }

  const menuLanguage = (
      <Menu>
        <Menu.Item onClick={() => setLanguageAll(enFlag, true)} key="1" className='d-flex justify-content-between align-items-center'>
          <img className='mr-4' width='20' height='20' src={enFlag} alt='enflag'/>
          <span>English</span>
        </Menu.Item>
        <Menu.Item onClick={() => setLanguageAll(vnFlag, false)} key="2" className='d-flex justify-content-between align-items-center'>
          <img className='mr-4' width='20' height='20' src={vnFlag} alt='vnflag'/>
          <span>Vietnam</span>
        </Menu.Item>
      </Menu>
  )

    return (
      <div className='header px-3 d-flex align-items-center justify-content-between'>
        <NavLink to='/courses' className='d-flex align-items-center justify-content-start'>
          <img className='mt-2' src={logo} alt='logo'/>
        </NavLink>

        <div className='d-flex align-items-center'>
          {
              userLogin?.username ? <Dropdown className='mr-1' overlay={menu}>
              <Button className='wrapper-user-info py-4 d-flex align-items-center'>
              <span><FormattedMessage id='HELLO' />, { userLogin.username }</span> <UserOutlined /> <span className='icon-down mt-1'><i className="fa fa-angle-down"></i></span> 
              </Button>
              </Dropdown> : ''
          }
          <Dropdown overlay={menuLanguage}>
              <Button className='wrapper-language py-4 d-flex align-items-center'>
              <img className='mr-4' width='20' height='20' src={language} alt='enflag'/>
              </Button>
          </Dropdown>
        </div>
          
      </div>
    )
}
