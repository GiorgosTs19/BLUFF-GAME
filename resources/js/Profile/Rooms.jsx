import {Room} from "../Game Components/Room";
import {CreateNewRoom} from "../Modals/CreateNewRoom";
import {JoinByLink} from "../Modals/JoinByLink";
import {useState} from "react";
import {Card} from "react-bootstrap";


export function Rooms({rooms,children}) {
    const [showingCreate,setShowingCreate] = useState(false),
    [showingJoin,setShowingJoin] = useState(false),
    handleCreateClick = () => setShowingCreate(!showingCreate),
    handleJoinClick = () => setShowingJoin(!showingJoin);
    return (
        <Card className='border-0 p-1 shadow h-100 gx-0' style={{background:"#AFBEC1"}}>
            <div className='card-title p-1 text-center' hidden={(showingCreate || showingJoin)}>
                <h2>Rooms</h2>
                {children}
            </div>
            <Card.Body className='p-2'>
                <div className="row gx-0 justify-content-center">
                    <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="false" hidden={showingCreate || showingJoin}>
                        <div className="carousel-inner justify-items-center">
                            {
                                rooms.length === 0 ?
                                <div className={'text-center my-4'}>
                                    <h4 className={'mb-5'}>No Active Rooms found.</h4>
                                    <p className={'fst-italic'}>
                                        Can't see any active rooms?
                                        <br></br>
                                        Try "Reload Rooms" or create your own room!
                                    </p>
                                </div>
                                : (rooms.map((RoomObj)=> {
                                    return <Room key={RoomObj.id} Room={RoomObj}>
                                        {children}
                                    </Room>
                                }))
                            }
                            <div className="carousel-indicators">
                                {rooms.map((room,index)=>{
                                    return <button key={index} type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to={index}
                                                   className="active" aria-current="true" aria-label={index}></button>
                                })}
                            </div>
                        </div>
                        <div>
                            <button className="carousel-control-prev me-1" type="button"
                                    data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                        </div>
                        <div>
                            <button className="carousel-control-next" type="button"
                                    data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                    <div className={"row m-2 text-center justify-content-center gx-0"}>
                        {!showingJoin && <CreateNewRoom handleClick={handleCreateClick}></CreateNewRoom>}
                        {!showingCreate &&<JoinByLink handleClick={handleJoinClick}></JoinByLink>}
                    </div>
                </div>
            </Card.Body>
        </Card>
    )
}
