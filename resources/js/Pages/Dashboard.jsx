import {Head, Link, useForm} from "@inertiajs/inertia-react";
import Authenticated from "../Layouts/AuthenticatedLayout";
import {Rooms} from "../Profile/Rooms";
import {Inertia} from "@inertiajs/inertia";
import {useEffect, useState} from "react";
import {UserContext} from "../Contexts/UserContext";
import {BeforeYouPlay} from "../Profile/BeforeYouPlay";
import {BugSubmissionForm} from "../Bugs/BugSubmissionForm";
import {ErrorContext} from "../Contexts/ErrorContext";
import {GotKickedModal} from "../Modals/GotKickedModal";
import {GameRules} from "../Modals/GameRules";
import {InviteLinkContext} from "../Contexts/InviteLinkContext";
import {Col, Row} from "react-bootstrap";

export default function Dashboard(props) {
    const [roomDoesntExistErrorVisible,setRoomDoesntExistErrorVisible] = useState(!!props.errors.Room_Doesnt_Exist),
    [RoomsList,setRooms] = useState(props.Rooms.Rooms),
    [kicked,setKicked] = useState(props.Kicked !== null);
    useEffect(()=> {
        const AlertVisible = roomDoesntExistErrorVisible && setTimeout(() => {
            setRoomDoesntExistErrorVisible(false);
            Inertia.reload({only:['Rooms']});
        }, 3000);

        return ()=>clearTimeout(AlertVisible);
    },[props.errors]);
    useEffect(()=>  {
        document.title = 'Bluff-Game';
    },[]);
    return (
        <InviteLinkContext.Provider value={props.InviteLink}>
            <ErrorContext.Provider value={props.errors}>
                <UserContext.Provider value={props.auth.user}>
                    <Authenticated>
                        <Head title="Dashboard" >
                            <title>Dashboard</title>
                        </Head>
                        <div className='container p-3 h-100 vw-100'>
                            <div className={'row gx-0'}>
                                <div className={'col-12 text-center h-auto'}>
                                    <div className={'row'}>
                                        <div className={'col'}>
                                            <button type="button btn-sm w-25" className="btn btn-outline-danger mb-3" data-bs-toggle="modal"
                                                    data-bs-target="#exampleModal">
                                                Please read before you play!
                                            </button>
                                        </div>
                                    </div>
                                    <GameRules></GameRules>
                                    <Row>
                                        <Col>
                                            {/*<UserContext.Provider value={props.auth.user}>*/}
                                            <Rooms rooms={RoomsList}>
                                                <Link href={route('home')} as={'button'}
                                                      className="btn btn-outline-dark text-center mt-4" type="button"
                                                      only={['Rooms']} preserveScroll={true}>
                                                    Reload Rooms
                                                </Link>
                                            </Rooms>
                                            {/*</UserContext.Provider>*/}
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                            <div className={'row align-self-end text-center'}>
                                <div className={'col'}>
                                    <div className={'col-12 mt-5'}>
                                        <BugSubmissionForm>

                                        </BugSubmissionForm>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <BeforeYouPlay>

                        </BeforeYouPlay>
                        {props.Kicked !== null && <GotKickedModal state={{kicked,setKicked}} report={props.Kicked}></GotKickedModal>}
                    </Authenticated>
                </UserContext.Provider>
            </ErrorContext.Provider>
        </InviteLinkContext.Provider>
    )
}
