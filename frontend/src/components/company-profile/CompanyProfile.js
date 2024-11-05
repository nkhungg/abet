import React from 'react'
import logo from '../../asset/images/logo.png'
import './CompanyProfile.scss'

export default function CompanyProfile() {
    return (
        <div className='company-profile mt-5 d-flex justify-content-start align-items-center'>
        <div className='mr-4'>
            <img src={logo} alt='userprofile' width='200' height='200' />
        </div>
        <div className='wrapper-profile'>
            <h3 className='text-center'>Profile settings</h3>
            <div className='col-12'>
                 <div className="form-group">
                     <label htmlFor="fname">Name: </label>
                     <input id="fname" 
                     disabled
                     value='ABET INFORMATION SYSTEM'
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
