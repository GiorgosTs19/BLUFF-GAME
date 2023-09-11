import {useContext, useEffect, useState} from "react";
import {UserContext} from "../Contexts/UserContext";
import {InviteLinkContext} from "../Contexts/InviteLinkContext";

export function InviteFriends({}) {
    const User = useContext(UserContext),
        InviteLink = useContext(InviteLinkContext),
        [copied,setCopied] = useState(false),
        [showingInvite,setShowingInvite] = useState(false);

    useEffect(() => {
        const timer = copied && setTimeout(() => {
            setCopied(!copied);
        }, 1500);
        return () => clearTimeout(timer);
    },[copied]);
    return (
        <div className={"card my-4 text-center " + (!showingInvite && 'border-bottom-0')} id={'Invite'}>
            <div className={'card-header bg-transparent'}>
                <h5 className={'text-info'} onClick={()=>{setShowingInvite(!showingInvite)}}>
                    Invite Your Friends
                </h5>
            </div>
            {showingInvite && <div className="card-body">
                <p>
                    You will need a second person to play against, so be sure to
                    <strong> let your friends know about this game so you can enjoy it together.</strong>
                </p>
                <p onClick={() => {
                    navigator.clipboard.writeText(InviteLink);
                    setCopied(true);
                }}>
                    <input className={'form-control text-center text-success'} type={'text'} disabled={true}
                           readOnly={true}
                           value={InviteLink}/>
                </p>
                {copied ? <strong className={'p-2 text-success '}>Link Copied !</strong> : ''}
                <p className={'text-info ' + (copied && 'mt-2')}>
                    You can share this link with your friends to invite them to play the game. ( Click on it to copy it )
                </p>
                {/*<h5>( Coming Soon )</h5>*/}
                {/*<h6>There are going to be perks for both of you when you invite a new player to the game.</h6>*/}
            </div>}
        </div>
    )
}
