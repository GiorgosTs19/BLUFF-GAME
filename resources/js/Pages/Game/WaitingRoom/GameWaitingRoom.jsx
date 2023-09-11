import {useEffect, useState} from "react";
import {Inertia} from "@inertiajs/inertia";
import {Link} from "@inertiajs/inertia-react";
import {GameRules} from "../../../Modals/GameRules";
import {KickPlayerModal} from "../../../Modals/KickPlayerModal";
import {Card, Col, Container, Row} from "react-bootstrap";
import {WaitingRoomPlayer} from "./WaitingRoomPlayer";
import {UserContext} from "../../../Contexts/UserContext";

export default function GameWaitingRoom(props) {
    const [Room,setRoom] = useState(props.Room),
        User = props.auth.user,
        [canClickReady,setCanClickReady] = useState(),MINUTE_MS = 5000,
        [hasInitiatedGame,setHasInitiatedGame] = useState(false),
        [copied,setCopied] = useState(false),
        [invitationLinkCopied,setInvitationLinkCopied] = useState(false),
        [graded,setGraded] = useState(false),
        [timed,setTimed] = useState(false);
    useEffect(() => {
        window.addEventListener('beforeunload', ()=>{
            Inertia.post(route('Leave_Room'),{RoomId:Room.id});
        });
    }, []);
    useEffect(() => {
        const timer = setTimeout(() => {
                Inertia.get(route('Check_For_New_Player'),{RoomId:Room.id},
                    {onSuccess:(res)=> {
                            setRoom(res.props.Room);
                            // console.log(res.props)
                            if(!canClickReady)
                                setCanClickReady(true);
                            if((res.props.Room && res.props.Room.OwnerReady) && (res.props.Room && res.props.Room.PlayerReady) && !hasInitiatedGame) {
                            // if(res.props.Room.Game_Active) {
                                Inertia.post(route('Activate_Room'),{ RoomId:res.props.Room.id,
                                    GameId:res.props.Room.GameId},{
                                    preserveScroll:true,
                                    onSuccess:
                                        (res)=> {
                                        setHasInitiatedGame(true);
                                        console.log('hasInitiatedGame',hasInitiatedGame);
                                        clearTimeout(timer)
                                        },preserveState:true
                                });
                            }
                        },preserveState:true});
        }, MINUTE_MS);
        return () => clearTimeout(timer);
    });
    useEffect(() => {
        const timer1 = copied && setTimeout(() => {
            setCopied(!copied);
        }, 2500);
        const timer2 = invitationLinkCopied && setTimeout(() => {
            setInvitationLinkCopied(!invitationLinkCopied);
        }, 2500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    },[copied,invitationLinkCopied]);
    useEffect(()=>{
        document.title = Room.Player
            ?
            (
                props.Room.OwnerReady && props.Room.PlayerReady
                    ?
                    'Both Players are ready, the Game will commence shortly!'
                    :
                    'Waiting for both players to be Ready!'
            )
            :
            'Waiting on Another Player . . .';
    },[props.Room])
    return (
        <UserContext.Provider value={User}>
            <Container fluid className='vh-100 position-relative py-3 px-5 overflow-auto theContainer'>
                <Row className={'align-items-center h-100 gx-0'}>
                    <Row className={'align-items-center gx-0'}>
                        <Col>
                            <h1 className={'text-center'}>
                                {props.Room.Name}
                            </h1>
                            <div className={'btn-group-vertical w-100'}>
                                <GameRules></GameRules>
                                {User.id === Room.Owner.id && Room.Password && <button className={'btn btn-sm btn-outline-secondary w-auto mx-auto my-2 p-3'}
                                                                                       onClick={() => {
                                                                                           navigator.clipboard.writeText(Room.Password && Room.Password);
                                                                                           setCopied(true);
                                                                                       }}>
                                    {copied ? 'Copied' :'Copy Room Password'}
                                </button>}
                            </div>
                        </Col>
                    </Row>
                    {/*<Row>*/}
                    {/*    <div className="form-check px-0">*/}
                    {/*        <Row className={'mx-0 text-center'}>*/}
                    {/*            <label className={"form-check-label " + ( timed === true ? 'text-success' : 'text-danger')} htmlFor="flexCheckDisabled">*/}
                    {/*                Timed Game <strong> ( Coming Soon ) </strong>*/}
                    {/*            </label>*/}
                    {/*            <input className="form-check-input mx-auto btn-lg" type="checkbox" value=""*/}
                    {/*                   disabled onChange={()=>{setTimed(!timed)}}/>*/}
                    {/*        </Row>*/}
                    {/*    </div>*/}
                    {/*    <div className="form-check px-0 mt-3">*/}
                    {/*        <div className={'row  mx-0 text-center '}>*/}
                    {/*            <label className={"form-check-label " + ( graded === true ? 'text-success' : 'text-danger')} htmlFor="flexCheckDisabled">*/}
                    {/*                Graded Game <strong> ( Coming Soon ) </strong>*/}
                    {/*            </label>*/}
                    {/*            <input className="form-check-input mx-auto btn-lg my-2" type="checkbox" value=""*/}
                    {/*                   disabled onChange={()=>{setGraded(!timed)}}/>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</Row>*/}
                    <Row className='px-0 gx-0 mb-sm-5 py-sm-2'>
                        <Col xs={12} sm={4} className='col-12 col-sm-4 text-center align-items-center my-3 order-0'>
                            <WaitingRoomPlayer name={props.Room.Owner.name} isReady={Room.OwnerReady}
                            canClickReady={canClickReady} showReadyButton={User.id === Room.Owner.id} Room={Room}>
                            </WaitingRoomPlayer>
                        </Col>
                        <Col xs={12} sm={4} className={'col-12 col-sm-4 text-center h-auto align-items-center order-2 order-sm-1'}>
                            {/*<div className={'row mb-5'}>*/}
                            {
                                (
                                    Room.Player
                                        ?
                                        (
                                            props.Room.OwnerReady && props.Room.PlayerReady
                                                ?
                                                <h5 className={'mb-1 mb-sm-5 text-success mt-3 mt-sm-5 mx-2'}>Both Players are ready, the Game will commence shortly!</h5>
                                                :
                                                <h5 className={'mb-1 mb-sm-5  text-warning mt-3 mt-sm-5 mx-2'}>Waiting for both players to be Ready!</h5>
                                        )
                                        :
                                        <h4 className={'mb-1 mb-sm-5  text-danger mt-3 mt-sm-5'}>Waiting on Another Player . . .</h4>
                                )
                            }
                            <Link href={route('Leave_Room')} method={'post'} data={{RoomId:Room.id}} as={'button'}
                                  className="btn btn-outline-danger mt-2 mt-sm-4" type="button" disabled={Room.Game_Active}>
                                Leave Room
                            </Link>
                        </Col>
                        <Col xs={12} sm={4}  className='text-center align-items-center my-3 order-1 order-sm-2'>
                            <Card className='border-1 p-2 h-100 shadow-lg bg-transparent'>
                                {/*style={{background:"#e6e6e6"}}*/}
                                <Card.Title className='p-1 text-center mt-5'>
                                    <h4>
                                        {props.Room.Player ? props.Room.Player.name : 'Empty Seat'}
                                    </h4>
                                </Card.Title>
                                <Card.Body>
                                    <Row>
                                        {Room.Player ? (Room.PlayerReady ? <h5 className={'mt-5 text-success'}>Player is Ready</h5> : <h5 className={'mt-5 text-warning'}>Player is not Ready</h5>)
                                            :
                                            <Col>
                                                <h5 className={'mt-5 text-danger'}>
                                                    No player has joined yet!
                                                </h5>
                                                {User.id === Room.Owner.id && <button className={'btn btn-outline-success my-3'} onClick={() => {
                                                    navigator.clipboard.writeText(Room.Invitation_Link && Room.Invitation_Link);
                                                    setInvitationLinkCopied(true)
                                                }}>
                                                    {invitationLinkCopied ? 'Copied ! ' : 'Copy Invitation Link'}
                                                </button>}
                                            </Col>
                                        }
                                    </Row>
                                    {(Room.Player && User.id === Room.Owner.id) && <KickPlayerModal
                                        User={Room.Player} Room={Room}>
                                    </KickPlayerModal>
                                    }
                                    <Row>
                                        {Room.Player && User.id === Room.Player.id &&
                                            <Col xs={12}>
                                                <Link href={route('Ready')} method={'post'} data={{RoomId:Room.id}} as={'button'}
                                                      className="btn btn-outline-success mt-4" type="button" disabled={!canClickReady || Room.PlayerReady}>
                                                    Ready
                                                </Link>
                                            </Col>
                                        }
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Row>
            </Container>
        </UserContext.Provider>
    )
}
