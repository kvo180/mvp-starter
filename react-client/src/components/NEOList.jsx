import React from 'react';
import NEOListItem from './NEOListItem.jsx';

const NEOList = (props) => {
  var neosArray = props.neos.map((neo) => {
    return <NEOListItem key={neo['neo_reference_id']} neo={neo}/>;
  });

  return (
  <div>
    <h4> Near Earth Objects </h4>
    There are { props.neos.length } near earth objects.
    <div>
      <div id="nameTitle">Name</div>
      <div id="sizeTitle">Diameter</div>
      <div id="velocityTitle">Relative Velocity</div>
    </div>
    <div>{neosArray}</div>
  </div>
  );
};

export default NEOList;