import React from 'react';
import "./App.css";

function Entry(props) {

    console.log("Entry");

    return (
        <div>
            <div class="entryContainer">
                <div class="entryTitle">{props.data.title}</div>
                {Array.from(props.data.strings.entries()).map((item, i) => {
                    return <p key={i} >{item[0]}: {item[1]}</p>;
                })}
                {Array.from(props.data.nats.entries()).map((item, i) => {
                    // console.log(typeof(item));
                    // console.log(JSON.stringify(item[0]));
                    return <p key={i} >{item[0]}: {item[1].toNumber()}</p>;
                })}
            </div>
        </div>
    )
}

export default Entry;