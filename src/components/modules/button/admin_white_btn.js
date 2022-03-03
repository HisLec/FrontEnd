import React from "react";

function WhiteButton(props) {
    return (
        <button 
            style={{cursor:"pointer" ,background:"white", width:'85px', height:
            '25px', fontSize:'14px', textAlign:'center', borderRadius:'6px', display:'inline-block', border:'1px solid black'}}
            className={props.class} onClick={props.click}>
                {props.name}
        </button>
    )
}
export default WhiteButton;

