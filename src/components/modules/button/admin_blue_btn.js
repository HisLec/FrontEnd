import React from "react";

function BlueButton(props) {
    return (
        <button 
            style={{background:"#a7a7c9", borderRadius:'7px', padding:'5px 14px', border:'none'}}
            className={props.class} onClick={props.click}>
                {props.name}
        </button>
    )
}
export default BlueButton;