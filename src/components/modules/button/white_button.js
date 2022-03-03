import React from "react";

// width:'115px', height: '40px'
function WhiteButton(props) {
    return (
        <button 
            style={{cursor:"pointer", padding:"5px 12px",background:"white", fontSize:'16px', fontWeight:'500', borderRadius:'6px', boxShadow:'2px 2px 0 rgb(0 0 0 / 20%)', border:'1px solid rgb(0 0 0 / 20%)'}}
            className={props.class} onClick={props.click}>
                {props.name}
        </button>
    )
}
export default WhiteButton;

