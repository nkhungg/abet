import React from 'react';
import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import loading from '../../asset/images/loading.gif'

export default function Loading(props) {
    const { isLoading } = useSelector((state) => state.LoadingReducer);
    return (
        <Fragment>
            {isLoading ? (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 99,
                    }}
                >
                    <div className='text-4xl text-white'>
                        <img
                            src={loading}
                            style={{
                                height: 60,
                                width: 60,
                            }}
                            alt='loading'
                        ></img>
                    </div>
                </div>
            ) : (
                ''
            )}
        </Fragment>
    );
}
