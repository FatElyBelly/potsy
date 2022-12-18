import React, { useRef } from 'react'
import { auth, db } from '../firebase.js'

const Signin = () => {
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const usernameRef = useRef(null)
    const signup = e => {
        e.preventDefault()
        auth.createUserWithEmailAndPassword(
            emailRef.current.value,
            passwordRef.current.value
        ).then(user => {
            console.log('Logged in successfully!')
        }).catch(err => {
            console.log(err)
        })
        const query = db.collection("users")
        query.add({
            email: emailRef.current.value,
            uid: auth.currentUser.uid,
            username: usernameRef.current.value
        })
    }
    return (
        <div className="signin">
            <form className="formDiv" action="#">
                <h1>Sign up</h1>
                <input className="signFormInput" placeholder="Email" ref={emailRef} type="email"/>
                <input className="signFormInput" placeholder="Username" ref={usernameRef} type="text"/>
                <input className="signFormInput" placeholder="Password" ref={passwordRef} type="password"/>
                <button className="signSubmitButton" onClick={signup}>Sign up</button>
            </form>
        </div>
    )
}

export default Signin
