import React from 'react';

const NEOListItem = (props) => (
  <div>
    <a href={props.neo.nasa_jpl_url} target="_blank">{ props.neo.name }</a>
    <div>{props.neo.estimated_diameter.miles.estimated_diameter_max} MILES</div>
    <div>{props.neo.close_approach_data[0].relative_velocity.miles_per_hour} MPH</div>
    <div>{props.neo.close_approach_data[0].close_approach_date}</div>
    <div>{props.neo.close_approach_data[0].miss_distance.miles} MILES</div>
    <div>{props.neo.is_potentially_hazardous_asteroid ? 'YES' : 'NO'}</div>
  </div>
)

export default NEOListItem;