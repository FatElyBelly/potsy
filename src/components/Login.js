import React, { useRef } from 'react'
import { auth } from '../firebase.js'
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Login = () => {
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const signin = e => {
        e.preventDefault()
        auth.signInWithEmailAndPassword(
            emailRef.current.value,
            passwordRef.current.value
        ).then(user => {
            console.log('Logged in successfully!')
        }).catch(err => {
            console.log(err)
            let elems = document.querySelectorAll('.inputIcon');
            let elems2 = document.querySelectorAll('.inputDiv')
            for (var i=0;i<elems.length;i++){
                elems[i].style.color = 'red'
                elems2[i].style.border = '1px solid red'
            }
        })
    }

    const emailFocus = () => {
        document.getElementById("emailInputDiv").style.backgroundColor = "rgb(88, 86, 214)"
        document.getElementById("emailInputDiv").style.border = "1px solid transparent"
        document.getElementById("emailIcon").style.color = "#fff"
        document.getElementById("emailInput").classList.add("placeholderActive")
    }

    const emailUnfocus = () => {
        document.getElementById("emailInputDiv").style.backgroundColor = "#172447"
        document.getElementById("emailInput").classList.remove("placeholderActive")
    }

    const passwordFocus = () => {
        document.getElementById("passwordInputDiv").style.backgroundColor = "rgb(88, 86, 214)"
        document.getElementById("passwordInputDiv").style.border = "1px solid transparent"
        document.getElementById("passwordIcon").style.color = "#fff"
        document.getElementById("passwordInput").classList.add("placeholderActive")
    }

    const passwordUnfocus = () => {
        document.getElementById("passwordInputDiv").style.backgroundColor = "#172447"
        document.getElementById("passwordInput").classList.remove("placeholderActive")
    }

    return (
        <div className="loginPage">
            <div className="loginDiv">
                <form className="loginForm" autoComplete="off">
                    <h1 className="loginTitle">LOGIN</h1>
                    <div className="loginInputs">
                        <div className="inputDiv" id="emailInputDiv">
                            <FontAwesomeIcon className="inputIcon" id="emailIcon" icon={faEnvelope} size="lg" color="#fff" />
                            <input onFocus={emailFocus} onBlur={emailUnfocus} id="emailInput" className="loginInput" type="email" placeholder="Email" ref={emailRef}/>
                        </div>

                        <div className="inputDiv" id="passwordInputDiv">
                            <FontAwesomeIcon className="inputIcon" id="passwordIcon" icon={faLock} size="lg" color="#fff" />
                            <input onFocus={passwordFocus} onBlur={passwordUnfocus} id="passwordInput" className="loginInput" type="password" placeholder="Password" ref={passwordRef}/>
                        </div>
                    </div>
                    <div className="lowerForm">
                        <a className="loginA">Forgot password</a>
                        <button className="loginButton" id="loginButton" onClick={signin}>CONNECT</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
