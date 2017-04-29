import React from 'react';

const NEOListItem = (props) => (
  <div>
    <a href={props.neo.url} target="_blank">{ props.neo.name }</a>
    <div>{props.neo.diameter} MILES</div>
    <div>{props.neo.velocity} MPH</div>
    <div>{props.neo.approachDate}</div>
    <div>{props.neo.missDistance} MILES</div>
    <div>{props.neo.hazardous ? 'YES' : 'NO'}</div>
  </div>
)

export default NEOListItem;