import React from 'react';

const NEOListItem = (props) => {
  return (
    <tr style={props.style}>
      <td><a style={props.style} href={props.neo.url} target="_blank">{ props.neo.name }</a></td>
      <td><a style={props.style} href={props.neo.url} target="_blank">{props.neo.diameter}</a></td>
      <td><a style={props.style} href={props.neo.url} target="_blank">{props.neo.velocity}</a></td>
      <td><a style={props.style} href={props.neo.url} target="_blank">{props.neo.approachDate}</a></td>
      <td><a style={props.style} href={props.neo.url} target="_blank">{props.neo.missDistance}</a></td>
      <td><a style={props.style} href={props.neo.url} target="_blank">{props.neo.hazardous ? 'YES' : 'NO'}</a></td>
    </tr>
  )
}

export default NEOListItem;