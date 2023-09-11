import {Link} from "@inertiajs/inertia-react";
import {useContext,useEffect,useState} from "react";
import {UserContext} from "../Contexts/UserContext";

export function BeforeYouPlay() {
    return (
        <div className="modal fade w-100 mx-auto" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel"
             aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header text-center">
                        <h1 className="modal-title fs-5 w-100 text-success" id="exampleModalLabel">
                            Before you play!
                        </h1>
                    </div>
                    <div className="modal-body">
                        <div className="row text-center justify-content-center">
                            <div className="col">
                                <div className="card mb-3">
                                    <div className={'card-header bg-transparent'}>
                                        <h5 className={'text-danger'}>
                                            This game is in early development stage.
                                        </h5>
                                    </div>
                                    <div className="card-body">
                                        <p>
                                            <strong>
                                                It is recommended that you try this game using either a laptop or a desktop.
                                            </strong>
                                        </p>
                                        <p>
                                            <strong>
                                                {/*When using your mobile, be advised that the responsiveness of the game to different devices*/}
                                                {/*is under heavy development ( It should be fine for most devices though ).*/}
                                                {/*<br></br>*/}
                                                {/*<br></br>*/}
                                                Always use landscape mode when playing on mobiles.
                                                <br></br>
                                                <br></br>
                                                Devices with known responsiveness issues :
                                                <br></br>
                                                ( during gameplay only )
                                                <br></br>
                                                <br></br>
                                                - Galaxy Fold
                                                <br></br>
                                                - Surface Duo
                                            </strong>
                                        </p>
                                        <p className={'fst-italic mt-2'}>
                                            * Please report any responsiveness abnormalities you come across using the Bug Submission Form.
                                            ( No matter which device you're playing on! )
                                        </p>
                                    </div>
                                </div>

                                {/*<div className="card mb-3">*/}
                                {/*    <div className={'card-header bg-transparent'}>*/}
                                {/*        <h5 className={'text-info'}>*/}
                                {/*            Join a Room.*/}
                                {/*        </h5>*/}
                                {/*    </div>*/}
                                {/*    <div className="card-body">*/}
                                {/*        <p className={'mt-2'}>*/}
                                {/*            You can either create a new Room, or join an existing one!*/}
                                {/*        </p>*/}
                                {/*        /!*<p>*!/*/}
                                {/*        /!*    If you can't see any active Rooms trying clicking "Reload", or create a new one!*!/*/}
                                {/*        /!*</p>*!/*/}
                                {/*        <p>*/}
                                {/*            Once you are in a room, after approximately 3-4 seconds the "Ready" button will get clickable.*/}
                                {/*        </p>*/}
                                {/*        <p>*/}
                                {/*           You will then have to wait for an opponent to join the room.*/}
                                {/*        </p>*/}
                                {/*        <p>*/}
                                {/*            When there are 2 players in the Room, you can click "Ready" whenever*/}
                                {/*            ( you can click the button even if an opponent hasn't yet joined if it is active )*/}
                                {/*            and wait for the game to begin.*/}
                                {/*        </p>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer text-center justify-content-center">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Got It</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
