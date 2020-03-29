import React from 'react';

import './Friends.css';
import FriendItem from './FriendItem/FriendItem';

const Friends = ({ friends, setFriendSelected }) => (
  <div className="friends">
    {friends.map((friend) => <FriendItem key={friend} item={friend} setFriendSelected={setFriendSelected}/>)}
  </div>
);

export default Friends;
