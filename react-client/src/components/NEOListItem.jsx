import React from 'react';

const NEOListItem = (props) => (
  <tr>
    <td><a href={props.neo.url} target="_blank">{ props.neo.name }</a></td>
    <td>{props.neo.diameter}</td>
    <td>{props.neo.velocity}</td>
    <td>{props.neo.approachDate}</td>
    <td>{props.neo.missDistance}</td>
    <td>{props.neo.hazardous ? 'YES' : 'NO'}</td>
  </tr>
)

export default NEOListItem;