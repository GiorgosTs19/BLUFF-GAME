import {FormFloatingTextInput} from "../Components/FormFloatingTextInput";
import InputError from "../Components/InputError";
import {useEffect, useState} from "react";
import {useForm} from "@inertiajs/inertia-react";
import {Inertia} from "@inertiajs/inertia";

export function CreateNewRoom({handleClick}) {
    const [show, setShow] = useState(false),
        handleClose = () => setShow(false),
        handleShow = () => {
            setShow(!show);
            handleClick();
        },
        [hasPassword,setHasPassword] = useState(false),
        [password,setPassword] = useState(''),
        [name,setName] = useState(''),
        [onlyByLink,setOnlyByLink] = useState(false),
        { data, setData, post, processing, errors, reset } = useForm({
            Name: name,
            Password: password,
            Capacity: 2,
            InviteOnly:onlyByLink,
        }),submit = (e) => {
            e.preventDefault();
            Inertia.post(route('New_Room'),{Name:name,Password:(hasPassword ? password : ''),
                Capacity:data.Capacity,InviteOnly:onlyByLink});
        },
        RandomPassword = (length)=>{
            let result = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            let counter = 0;
            while (counter < length) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                counter += 1;
            }
            setPassword(result);
        };
    useEffect(()=>{
        if(!show){
            setOnlyByLink(false);
            setHasPassword(false);
        }
    },[show]);
    useEffect(()=>{
        if(onlyByLink) {
            setHasPassword(false);
        }
    },[onlyByLink]);

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };
    return (
        <>
            { !show && <button className="btn btn-outline-primary w-auto text-center mx-1" type="button" onClick={handleShow}>
                Create Room
            </button>}
            <div hidden={!show} className={'text-center'}>
                <h3 className="offcanvas-title" id="offcanvasExampleLabel">Create New Room</h3>
                {/*<form onSubmit={submit} className='p-4'>*/}
                    <div className="row justify-content-center bg-transparent">
                        <FormFloatingTextInput
                            type='text'
                            name='Name'
                            value={data.Name}
                            required={true}
                            handleChange={(e)=>{setName(e.target.value)}}
                            placeHolder='Name *'
                            className={'mb-4'}
                            divClassName={'w-auto'}
                        ></FormFloatingTextInput>
                        <InputError message={errors.Name} className="mt-2" />
                        {/*<FormFloatingTextInput*/}
                        {/*    type='text'*/}
                        {/*    name='Capacity'*/}
                        {/*    value={2}*/}
                        {/*    required={true}*/}
                        {/*    handleChange={onHandleChange}*/}
                        {/*    // placeHolder='Capacity'*/}
                        {/*    disabled={true}*/}
                        {/*    className={'mb-4 d-none'}*/}
                        {/*></FormFloatingTextInput>*/}
                        {/*<InputError message={errors.Capacity} className="mt-2" />*/}
                        <h6 className='ps-3 text-center'>Password</h6>
                        <input className="form-check-input my-3" type="checkbox" checked={hasPassword}
                               onChange={()=>setHasPassword(!hasPassword)} aria-label="Checkbox for Password." disabled={onlyByLink}/>
                        {hasPassword && <>
                            <div className="input-group w-auto">
                                <button className="btn btn-info btn-sm py-0 " type="button" onClick={()=>RandomPassword(10)}>Random</button>
                                <input type={'text'} name={'Password'} value={password} required={hasPassword}
                                       onChange={(e)=>setPassword(e.target.value)}
                                       placeholder='Password' className={'form-control my-0 '}/>
                            </div>
                            <p className={'text-danger my-2 text-center'}>
                                <strong>
                                    Only people who know the password will be able to join the Room!
                                </strong>
                            </p>
                            <InputError message={errors.Password} className="mt-2" />
                        </>}
                        <h6 className='ps-3 text-center'>Invite Only</h6>
                        <input className="form-check-input my-3" type="checkbox" checked={onlyByLink}
                               onChange={()=>setOnlyByLink(!onlyByLink)} aria-label="Checkbox for Invite Only."/>
                        {onlyByLink && <>
                            <p className={'text-danger text-center'}>
                                <strong>
                                    Your room will not be visible in the Rooms Tab on anyone's home screen.
                                </strong>
                            </p>
                            <p className={'text-danger text-center'}>
                                <strong>
                                    People can only join a room with an invite Link.
                                    <br></br>
                                    ( You can share the link after creating the Room
                                </strong>
                            </p>
                        </>}
                    </div>
                {/*</form>*/}
                { show && <button className="btn btn-outline-danger w-auto text-center mx-1" type="button" onClick={handleShow}>
                    Back
                </button>}
                <button className='btn btn-outline-success w-auto mx-auto' disabled={name===''} onClick={submit}>Create Room</button>
            </div>
        </>
    )
}
