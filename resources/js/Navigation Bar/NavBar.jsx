import {Link} from "@inertiajs/inertia-react";
import {useContext} from "react";
import {UserContext} from "../Contexts/UserContext";
import {PersonalInfo} from "../Profile/PersonalInfo";

export function NavBar({Guest,InGame,GameId}) {
    const inGame = InGame ? InGame : false,
        User = useContext(UserContext);
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light text-center">
            <div className={"container-fluid " + (inGame ? ' w-100 text-center' : '')}>
                <Link href={route('home')}>
                    <img src={'Images/card-game.png'} alt={'Bluffing'} className={'position-static'} width={64}></img>
                </Link>
                {
                    User.ca &&
                    <Link href={route('AdminPanel')} as={'button'} className={'btn btn-outline-primary mx-5'}>
                        Admin Panel
                    </Link>
                }
                {/*<span className={'p-1 ms-0 ms-xl-5'}>*/}
                {/*    <img src={'Images/greece.png'} style={{height:40,width:40,opacity:'40%'}} alt={'Greek'}></img>*/}
                {/*    <h6 style={{opacity:'50%'}}>( Coming Soon )</h6>*/}
                {/*</span>*/}
                <PersonalInfo></PersonalInfo>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target=".collapse" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end mt-3 mt-lg-0 text-center"
                     id="navbarSupportedContent">
                    <h5 className={'p-2 me-lg-5 mx-lg-0 mx-auto'}>Created by Giorgos Tsourdiou</h5>
                    <Link href={route('logout')} method={'post'} as={'button'}
                          className="btn btn-outline-danger text-center nav-item" type="button" only={['Rooms']}>
                        Logout
                    </Link>
                    <a className={'btn btn-light'}
                       href="https://www.flaticon.com/free-icons/group" title="group icons">
                        Icons by Flaticon
                    </a>
                </div>
            </div>
        </nav>
    );
}
