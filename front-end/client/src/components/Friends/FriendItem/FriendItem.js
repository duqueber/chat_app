import React, { useState} from 'react';
import './FriendItem.css';

const FriendItem = ({item, setFriendSelected}) => {

  const [selected, setSelected] = useState(false);

  const changeColor = (value) => {
    if (!selected){
      setFriendSelected(value);
      console.log (value);
    }
    setSelected(!selected);
}
  return  (
    <button value={item} className={selected ? 'clicked' : 'none'} onClick= {({target: {value}}) => changeColor(value)}>{item}
      </button>
  )
}

export default FriendItem;
