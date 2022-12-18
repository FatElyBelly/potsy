import Login from './Login.js'
import Signup from './Signup.js'
import React from 'react'
import './ArrowStyle.scss'

const Home = (props) => {

    var currentChatCollection = window.location.pathname.replace('/', '')

    return (
        <div className="homeDiv">
            {currentChatCollection == "login" ? <Login /> : currentChatCollection == "signup" ? <Signup /> : 
            <div className="homeTDiv">

                <div>
                    <div className="homeNavbar">
                        <a className="homeNavLink">Home</a>
                        <a className="homeNavLink">About</a>
                        <a href="/login" className="homeNavLink">Connect</a>
                    </div>
                    <div className="wave top-wave"></div>
                </div>

                <div className="homeMainContent">
                    <div className="homeCenterContent">
                        <h1 className="primaryHomeTitle">FIND YOUR</h1>
                        <h1 id="spin" className="secondaryHomeTitle"></h1>
                    </div>
                    <div className="homeLowerContent">
                        <button onClick={() => { window.location.href = "/login" }} onMouseOver={() => {document.getElementById("getStartedButton").innerHTML = "Connect"}} onMouseOut={() => {document.getElementById("getStartedButton").innerHTML = "Connect"}} id="getStartedButton" className="getStartedButton">Connect</button>
                    </div>
                </div>

                <div className="arrowDiv">
                    <div class="arrow">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>

            </div>
            }
        </div>
    )
}

export default Home