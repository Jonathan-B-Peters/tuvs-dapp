import React from 'react';
import Entry from './Entry'

function Identity(props) {
    return (
        <div>
            <h1>Your Identity</h1>
            <div class="entriesContainer">
                {props.entries &&
                Array.from(props.entries.values()).map((entry, i) => {
                    return <Entry key={i} data={entry}/>;
                })}
            </div>
        </div>
    )
}

export default Identity;