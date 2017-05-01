import React from 'react';
import NEOListItem from './NEOListItem.jsx';

const NEOList = (props) => {
  var neosArray = props.neos.map((neo) => {
    console.log(neo.hazardous);
    return <NEOListItem key={neo.neoId} neo={neo} style={neo.hazardous ?
      {color: 'red', fontWeight: 'bold', textDecoration: 'none'} :
      {color: 'black', fontWeight: 'normal', textDecoration: 'none'}}/>;
  });

  return (
  <div>
    <h4> Near Earth Objects </h4>
    There are { props.neos.length } near earth objects.
    <div>
      {props.neos.length > 0 ?
        <table>
          <thead>
            <tr>
              <th id="nameTitle">Name</th>
              <th id="sizeTitle">Diameter (mi)</th>
              <th id="velocityTitle">Relative Velocity (mi/h)</th>
              <th id="approachDate">Approach Date</th>
              <th id="missDistance">Miss Distance (mi)</th>
              <th id="hazardous">Potentially Hazardous</th>
            </tr>
          </thead>
          <tbody>
            {neosArray}
          </tbody>
        </table> : null}
    </div>
  </div>
  );
};

export default NEOList;