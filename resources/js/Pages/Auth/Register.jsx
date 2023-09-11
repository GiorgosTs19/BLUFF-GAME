import React, {useEffect, useState} from 'react';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import {FormFloatingTextInput} from "../../Components/FormFloatingTextInput";
import {FormCheck} from "react-bootstrap";

export default function Register({refUser}) {
    const [iEE, setIEE] = useState(false),
        // [showingPasswordStored,setShowingPasswordStored] = useState(false),
        { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        iee:false,
        refUserID : refUser,
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };
    return (
            <div className="form-container sign-up-container h-100 overflow-scroll">
                <form onSubmit={submit} className={'fcr'}>
                    <h1 className='my-3'>Create Account</h1>
                    <div className="row">
                        <div className={'col'}>
                            <label className="form-check-label " htmlFor="flexSwitchCheckDefault">
                                <h6>
                                    I am IEE ( Information and Electronic Engineer )
                                </h6>
                            </label>
                            <br></br>
                            <input className="form-check-input p-2 mx-auto" type="checkbox" role="switch" id="flexSwitchCheckDefault" name={'iee'}
                                   onChange={(e)=>{setIEE(e.target.checked);onHandleChange(e)}}/>
                        </div>
                    </div>
                    {iEE && <p className={'text-info'}>Only used for statistical purposes.</p>}
                    <FormFloatingTextInput
                        type="text"
                        name="name"
                        value={data.name}
                        autoComplete="name"
                        isFocused={true}
                        handleChange={onHandleChange}
                        required={true}
                        placeHolder={'Name'}
                        className={''}
                    />
                    <FormFloatingTextInput
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="username"
                        handleChange={onHandleChange}
                        required={true}
                        placeHolder={'Email'}
                    />
                    <FormFloatingTextInput
                        type="password"
                        name="password"
                        value={data.password}
                        autoComplete="new-password"
                        handleChange={onHandleChange}
                        required={true}
                        placeHolder={'Password'}
                    />
                    <FormFloatingTextInput
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        handleChange={onHandleChange}
                        required={true}
                        placeHolder={'Confirm Password'}
                    />
                    {/*<input name={'refUser'} type={'text'} value={refUser ? refUser : ''} hidden={true} readOnly={true}/>*/}
                    {errors.name && <p className={'text-danger'}>{errors.name}</p>}
                    {errors.email && <p className={'text-danger'}>{errors.email}</p>}
                    {errors.password && <p className={'text-danger'}>{errors.password}</p>}
                    {errors.password_confirmation && <p className={'text-danger'}>{errors.password_confirmation}</p>}
                    <button className='btn btn-outline-success border-3'>Sign Up</button>
                {/*    <span className={'text-info text-center '} onClick={()=>{setShowingPasswordStored(!showingPasswordStored)}}>*/}
                {/*    <h6 className={'mt-3 px-2'}>How is my password stored?</h6>*/}
                {/*    <h3>&#9432;</h3>*/}
                {/*</span>*/}
                {/*    {showingPasswordStored && <p className={'text-danger text-center'}>Your passwords are hashed using Bcrypt hashing function.</p>}*/}
                </form>
            </div>
    );
}
