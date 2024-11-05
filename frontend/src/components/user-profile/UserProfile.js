import React from 'react'
import {useSelector} from 'react-redux';
import usericon from '../../asset/images/user1.png'
import './UserProfile.scss'

export default function UserProfile() {
    const { userLogin } = useSelector(state => state.UserReducer)

    return (
        <div className='user-profile mt-5 d-flex justify-content-start align-items-center'>
           <div className='mr-4'>
               <img src={usericon} alt='userprofile' width='200' height='200' />
           </div>
           <div className='wrapper-user-profile'>
               <h3 className='text-center'>Profile settings</h3>
               <div className='col-12'>
                    <div className="form-group">
                        <label htmlFor="id">ID: </label>
                        <input id="id" 
                        disabled
                        value={userLogin?.id}
                        className="form-control" type="text" />
                    </div>
               </div>
               <div className='col-12'>
                    <div className="form-group">
                        <label htmlFor="role">Role: </label>
                        <input id="role" 
                        disabled
                        value={userLogin?.role}
                        className="form-control" type="text" />
                    </div>
               </div>
               <div className='col-12'>
                    <div className="form-group">
                        <label htmlFor="username">Username: </label>
                        <input id="username" 
                        disabled
                        value={userLogin?.username}
                        className="form-control" type="text" />
                    </div>
               </div>
               <div className='col-12'>
                    <div className="form-group">
                        <label htmlFor="displayname">Displayname: </label>
                        <input id="displayname" 
                        disabled
                        value={userLogin?.displayName}
                        className="form-control" type="text" />
                    </div>
               </div>
               <div className='d-flex justify-content-end'>
                <span className='btn-edit text-primary text-right'>Edit profile</span>
               </div>
            </div>
        </div>
    )
}
