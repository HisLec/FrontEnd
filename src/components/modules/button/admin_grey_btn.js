import React from "react";

function GreyButton(props) {
    return (
        <button 
            style={{fontSize:'14px',cursor:"pointer",background:"#e2e2e2", borderRadius:'7px', padding:'7px 18px', border:'1px solid black'}}
            className={props.class} onClick={props.click}>
                {props.name}
        </button>
    )
}
export default GreyButton;