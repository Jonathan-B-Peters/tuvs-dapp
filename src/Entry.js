import React from 'react';
import "./App.css";

function Entry(props) {

    return (
        <div>
            <div class="entryContainer">
                <div class="entryTitle">{props.data.title}</div>
                {Array.from(props.data.strings.entries()).map((item, i) => {
                    return <p key={i} ><span class="heavy">{item[0]}: </span>{item[1]}</p>;
                })}
                {Array.from(props.data.nats.entries()).map((item, i) => {
                    return <p key={i} ><span class="heavy">{item[0]}: </span>{item[1].toNumber()}</p>;
                })}
            </div>
        </div>
    )
}

export default Entry;