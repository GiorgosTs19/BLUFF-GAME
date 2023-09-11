import {useState} from "react";

export function Surveys({Surveys}) {
    const [showing,setShowing] = useState(false);
    return (
        <div className={'card'} >
            <div className={'card-header'}>
                <div style={{height:15,width:15,backgroundColor:"green",
                    borderRadius:'50%',display:"inline-block"}}></div>
                Active Surveys
            </div>
            <div className={'card-body'} hidden={!showing}>

            </div>
        </div>
    )
}
