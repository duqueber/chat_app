import React from 'react';

import './Friends.css';

const Friends = ({ friends }) => (
  <div className="friends">
    {friends.map((friend, i) => <div key={i} item={friend}/>)}
  </div>
);

export default Friends;
