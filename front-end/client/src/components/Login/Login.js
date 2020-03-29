import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import '../../borrowed_css/Join/Join.css';

const Login = () => {
  // use state without writting a class
  const [user, setUser] = useState('');

  return (
    <div className="joinOuterContainer">
       <div className="joinInnerContainer">
         <h1 className="heading">NatChat</h1>
         <div>
           <input placeholder="User" className="joinInput" type="text" onChange={(event) => setUser(event.target.value)} />
         </div>
         <Link onClick={e => (!user) ? e.preventDefault() : null} to={`/chat?user=${user}`}>
           <button className={'button mt-20'} type="submit">Login</button>
         </Link>
       </div>
     </div>
  )
}

export default Login;
