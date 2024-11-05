import React from 'react'
import './Login.scss'
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { signInActionApi } from '../../actions/api-actions/UserAction'

export default function Login() {
    const dispatch = useDispatch()
    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        onSubmit: (values) => {
            dispatch(signInActionApi(values))
        }
    })

    return (
        <div className='login py-4'>
            <h3 className='text-center mt-3 mb-5'>SIGN IN YOUR ACCOUNT</h3>
            <form onSubmit={formik.handleSubmit} className='px-4 mb-4 pb-3'>
                <div className='mt-2'>
                    <input className='account' type='text' name='username' onChange={formik.handleChange} required></input>
                    <label className='account'>Account</label>
                </div>
                <div className='mt-2'>
                    <input type='password' name='password' onChange={formik.handleChange} required></input>
                    <label>Password</label>
                </div>
                <div className='wrapper-submit py-4'>
                <button type='submit' className='btn-login btn btn-info font-weight-bold'>Submit</button>
                </div>
            </form>
            <div className='font-weight-bold py-3 px-4 d-flex justify-content-between align-items-center'>
                <div className='more-help'>Not a member yet?<span className='ml-2 text-primary'>Sign Up.</span></div>
                <div className='more-help text-danger'>Forgot your password?</div>
            </div>  
        </div>
    )
}
