import React from 'react';
import './SignUp.scss';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { history } from '../../App';
import { signUpActionApi } from '../../actions/api-actions/UserAction';

export default function SignUp() {
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            email: ''
        },
        onSubmit: (values) => {
            dispatch(signUpActionApi(values));
        }
    });

    return (
        <div className='signup py-4'>  {/* Có thể đổi className thành 'signup' nếu cần thiết */}
            <h3 className='text-center mt-3 mb-5'>CREATE YOUR ACCOUNT</h3>
            <form onSubmit={formik.handleSubmit} className='px-4 mb-4 pb-3'>
                <div className='mt-2'>
                    <input className='account' type='text' name='username' onChange={formik.handleChange} required />
                    <label className='account'>Username</label>
                </div>
                <div className='mt-2'>
                    <input type='email' name='email' onChange={formik.handleChange} required />
                    <label>Email</label>
                </div>
                <div className='mt-2'>
                    <input type='password' name='password' onChange={formik.handleChange} required />
                    <label>Password</label>
                </div>
                <div className='wrapper-submit py-4'>
                    <button type='submit' className='btn-signup btn btn-info font-weight-bold'>Sign Up</button>
                </div>
            </form>
            <div className='font-weight-bold py-3 px-4 d-flex justify-content-between align-items-center'>
                <div className='more-help'>Already a member?
                    <span
                        className='ml-2 text-primary'
                        style={{ cursor: 'pointer' }}
                        onClick={() => history.push('/login')}
                    >
                        Sign In
                    </span>
                </div>
            </div>
        </div>
    );
}
