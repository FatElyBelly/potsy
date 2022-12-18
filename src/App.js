import './App.css'
import './Style.scss'
import Chat from './components/Chat.js'
import {auth} from './firebase.js'
import Home from './components/Home.js'
import {useAuthState} from 'react-firebase-hooks/auth'
import React, {useState} from 'react'

function App() {

  const [user] = useAuthState(auth)

  window.onclick = (event) => {
    if (event.target === document.getElementById("createGroupPopup")){
      document.getElementById("createGroupPopup").style.display = "none"
    }
    if (event.target === document.getElementById("profilePopup")){
      document.getElementById("profilePopup").style.display = "none"
    }
  }

  return (
    <div className="App">
      {user ? <Chat/> : <Home/>}
    </div>
  );
}

export default App;