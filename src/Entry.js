import React from 'react';

function Entry(props) {

    console.log("Entry");

    return (
        <div>
            <h1>Data:</h1>
            <h2>{props.data.title}</h2>
        </div>
    )
}

export default Entry;