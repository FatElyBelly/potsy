/* eslint-disable */

import firebase from "firebase"
import React, { Component } from 'react'
import { auth, db } from '../firebase'
import Header from './Header.js'
import { faPlus, faMinus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dummypfp from '../img/dummypfp.png'

class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      currentChatCollection: window.location.pathname.replace('/', ''),
      sidenavOpen: false,
      rightSidenavOpen: false,
      userSettingsOpen: false,
      publicGroupList: [],
      memberList: [],
      memberInfoList: [],
      msg: '',
      userGroups: [],
      createGroupName: '',
      createGroupPrivate: false,
      createGroupUserList: [],
      createGroupUserNum: 0,
      currentGroupPrivate: false,
      currentUsername: 'user',
      userDocID: '',
      currentUserMod: false,
      userInGroup: false,
      currentMessage: {
        text: 'test',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        photoURL: '',
        uid: '',
        username: 'user',
      },
      currentMessageFormattedDate: '',
      currentMessageFormattedTime: '',
    }
    this.scroll = React.createRef()
  }

  scrollDown = () => {
    this.scroll.current.scrollIntoView()
  }

  getUsername = () => {
    const query = db.collection("users")
    query.onSnapshot((snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (doc.data().uid == auth.currentUser.uid) {
          this.setState({
            currentUsername: doc.data().username
          })
        }
      })
    })
  }

  getMessages = () => {
    setTimeout(() => {
      this.setState({
        messages: [],
        currentChatCollection: window.location.pathname.replace('/', ''),
      })
      this.checkIfGroupPrivate()
      const query = db.collection('groups').doc(this.state.currentChatCollection).collection("messages").orderBy('createdAt');
      query.onSnapshot((snapshot) => {
        var list = []
        snapshot.docs.forEach(doc => {
          list.push(doc.data())
        })
        this.setState({
          messages: list
        })
      })
    }, 10)
    this.scrollDown()
  }

  getPublicGroups = () => {
    const query = db.collection('groups')
    query.onSnapshot((snapshot) => {
      var list = []
      snapshot.docs.forEach(doc => {
        if (doc.data().private === false) {
          list.push(doc.data())
        }
      })
      this.setState({
        publicGroupList: list
      })
    })
  }

  getGroupMembers = () => {
    const usersQuery = db.collection("groups")
    var newMemberList = []
    usersQuery.onSnapshot((snapshot) => {
      snapshot.docs.forEach(doc => {
        if (doc.data().name === this.state.currentChatCollection) {
          newMemberList = doc.data().users
        }
      })
      this.setState({
        memberList: newMemberList
      })
    })
    const userInfoQuery = db.collection("users")
    var newMemberInfoList = []
    userInfoQuery.onSnapshot((snapshot) => {
      snapshot.docs.forEach(doc => {
        if (this.state.memberList.includes(doc.data().uid)) {
          newMemberInfoList.push(doc.data())
        }
        this.setState({
            memberInfoList: newMemberInfoList
          })
      })
    })
  }


  sendMessage = (e) => {
    this.setState({
      msg: ''
    })
    e.preventDefault()
    const { uid, photoURL } = auth.currentUser
    if (!(this.state.msg.replace(/\s/g, '').length == 0)) {
      const query = db.collection('groups').doc(this.state.currentChatCollection).collection('messages')
      query.add({
        text: this.state.msg,
        photoURL,
        uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        messageid: this.generateID(20),
      })
    }
    this.scrollDown()
  }

  getUserGroups = () => {
    const query = db.collection('groups')
    query.onSnapshot((snapshot) => {
      var list = []
      snapshot.docs.forEach(doc => {
        if ((doc.data().users.includes(auth.currentUser.uid)) && (doc.data().private == true)) {
          list.push(doc.data())
        }
      })
      this.setState({
        userGroups: list
      })
    })
  }

  addUserDataSignIn = () => {
    const query = db.collection('users')
    var userAlreadyIn = false
    query.onSnapshot((snapshot) => {
      snapshot.docs.forEach(doc => {
        if (doc.data().uid == auth.currentUser.uid) {
          userAlreadyIn = true
        }
      })
      if (userAlreadyIn == false) {
        query.add({
          email: auth.currentUser.email,
          photoURL: auth.currentUser.photoURL,
          uid: auth.currentUser.uid,
          username: this.state.currentUsername,
        })
      }
    })
  }

  checkUserInGroup = () => {
    const ref = db.collection("groups")
    var userInGroupLocal = false
    ref.onSnapshot((snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (doc.data().name == this.state.currentChatCollection) {
          if (doc.data().private) {
            if (doc.data().users.includes(auth.currentUser.uid)) {
              userInGroupLocal = true
            } else {
              userInGroupLocal = false
            }
          } else {
            userInGroupLocal = true
          }
        }
      })
      this.setState({
        userInGroup: userInGroupLocal
      })
    })
  }

  componentDidMount() {
    if (this.state.currentChatCollection == ''){
      this.setState({
        currentChatCollection: 'public'
      })
    }
    this.getUserID()
    this.getUsername()
    this.checkUserInGroup()
    if (this.state.userInGroup == false) {
      window.history.pushState('public', 'ElyBelly', '/public')
    }
    this.resetGroupComponents()
  }

  resetGroupComponents = () => {
    this.getMessages()
    this.getPublicGroups()
    this.getGroupMembers()
    this.checkIfGroupPrivate()
    this.getUserGroups()
    this.scrollDown()
  }

  setSideNav = (setSidenav) => {
    this.setState({
      sidenavOpen: setSidenav,
    })
    if (setSidenav) {
      document.getElementById("sideNav").style.width = "275px"
      document.getElementById("menuButton").innerHTML = "<i class='fa fa-times fa-3x'></i>"

      document.getElementById("messageInput").style.width = "66%"

      document.getElementById("main").style.marginLeft = "220px"
      setTimeout(() => { this.openMenuDiv() }, 370)
    } else {
      document.getElementById("sideNav").style.width = "55px"
      document.getElementById("menuButton").innerHTML = "<i class='fa fa-bars fa-3x'></i>"

      document.getElementById("main").style.marginLeft = "0px"

      document.getElementById("messageInput").style.width = "80%"

      this.closeMenuDiv()
    }
  }

  setRightSideNav = (setSidenav) => {
    this.setState({
      rightSidenavOpen: setSidenav,
    })
    if (setSidenav) {
      document.getElementById("rightSideNav").style.width = "275px"
      document.getElementById("main").style.marginRight = "270px"
    } else {
      document.getElementById("rightSideNav").style.width = "0px"
      document.getElementById("main").style.marginRight = "0px"
    }
  }

  checkIfGroupPrivate = () => {
    const query = db.collection("groups")
    var currentPrivate
    query.onSnapshot((snapshot) => {
      snapshot.docs.forEach(doc => {
        if (doc.data().name == this.state.currentChatCollection) {
          currentPrivate = doc.data().private
          this.setState({
            currentGroupPrivate: currentPrivate
          })
        }
      })
    })
  }

  openMenuDiv = () => {
    document.getElementById("menuDiv").style.display = "inline-block"
  }
  closeMenuDiv = () => {
    document.getElementById("menuDiv").style.display = "none"
  }

  openGroupPopup = () => {
    document.getElementById("createGroupPopup").style.display = "block"
  }
  closeGroupPopup = () => {
    document.getElementById("createGroupPopup").style.display = "none"
  }

  createNewGroup = () => {
    var userList = []
    const userQuery = db.collection("users")
    userQuery.onSnapshot((snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (this.state.createGroupUserList.includes(doc.data().username)) {
          userList.push(doc.data().uid)
        }
      })
      userList.push(auth.currentUser.uid)
      const data = {
        name: this.state.createGroupName,
        private: this.state.createGroupPrivate,
        users: userList
      }
      const query = db.collection("groups")
      query.doc(data.name).set(data)
      const { uid, photoURL } = auth.currentUser
      db.collection("groups").doc(data.name).collection("messages").add({
        text: 'Welcome to ' + data.name + '!',
        photoURL,
        uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        messageid: this.generateID(20),
      })
    })
  }

  getUserID = () => {
    const query = db.collection("users")
    query.onSnapshot((snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (doc.data().uid == auth.currentUser.uid) {
          this.setState({
            userDocID: doc.id
          })
        }
      })
    })
  }

  // changeUsername = () => {
  //   const ref = db.collection("users")
  //   var available = true
  //   ref.onSnapshot((snapshot) => {
  //     snapshot.docs.forEach((doc) => {
  //       if (doc.data().username == this.state.currentUsername) {
  //         available = false
  //       }
  //     })
  //     if (available) {
  //       db.collection("users").doc(this.state.userDocID).update({ username: this.state.currentUsername })
  //       this.closeProfilePopup()
  //     } else {
  //       alert("Username taken")
  //       this.getUsername()
  //     }
  //   })
  // }

  getMessageInfo = (newMessageid) => {
    var currentMessageObject = this.state.currentMessage
    const messageRef = db.collection("groups").doc(this.state.currentChatCollection).collection("messages")
    messageRef.onSnapshot((snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (doc.data().messageid == newMessageid) {
          currentMessageObject = doc.data()
        }
      })
    })

    const userRef = db.collection("users")
    userRef.onSnapshot((snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (doc.data().uid == currentMessageObject.uid) {
          var currentUsername = doc.data().username
          if (currentUsername.length > 13) {
            var changeUsername = ''
            for (let i = 0; i < 11; i++) {
              changeUsername += currentUsername[i]
            }
            changeUsername += '..'
            currentUsername = changeUsername
          }
          currentMessageObject.username = currentUsername
        }
      })
      var messageDate = currentMessageObject.createdAt.toDate()
      var messageDateDay = messageDate.getDate()
      var messageMonth = messageDate.getMonth() + 1
      var messageYear = messageDate.getFullYear()
      var formattedMessageDate = messageDateDay + '/' + messageMonth + '/' + messageYear
      var messageHour = messageDate.getHours()
      var messageMinute = messageDate.getMinutes()
      var formattedMessageTime = messageHour + ':' + messageMinute

      this.setState({
        currentMessage: currentMessageObject,
        currentMessageFormattedDate: formattedMessageDate,
        currentMessageFormattedTime: formattedMessageTime,
      })
    })

  }

  generateID = (n) => {
    var add = 1, max = 12 - add
    if (n > max) {
      return this.generateID(max) + this.generateID(n - max)
    }
    max = Math.pow(10, n + add)
    var min = max / 10
    var number = Math.floor(Math.random() * (max - min + 1)) + min
    return ("" + number).substring(add)
  }

  render() {
    return (
      <div className="chat">
        <Header />

        {/* Create new group popup */}
        <div id="createGroupPopup" className="popup">
          <div className="popup-content">
            <div className="popup-header">
              <span className="close" onClick={this.closeGroupPopup}>&times;</span>
              <h2 className="popupTitle">Create new group</h2>
            </div>
            <div className="popup-body">
              <div className="popupSetting" id="groupNameSetting">
                <p className="settingLabel">Group name: </p>
                <input value={this.state.createGroupName} onChange={(e) => this.setState({ createGroupName: e.target.value })} type="text" className="popupInput" id="groupNameInput" placeholder="Enter name" autoComplete="off" />
              </div>

              <div className="popupSetting" id="privateSetting">
                <p className="settingLabel">Private</p>
                <label className="switch">
                  <input className="checkboxInput" id="groupSettingPrivateCheckbox" type="checkbox" onChange={
                    () => {
                      var checked = document.getElementById("groupSettingPrivateCheckbox").checked
                      this.setState({
                        createGroupPrivate: checked,
                      })
                    }
                  } />
                  <span className="sliderRound"></span>
                </label>
              </div>

              <div className="popupSetting" id="groupUsersSetting">
                {this.state.createGroupPrivate ? (
                  <div className="user">
                    <div className="createGroupSetting" id="userGroupSetting">
                      <p className="settingLabel">Users:</p>
                      <div className="userListGroupSetting">
                        {this.state.createGroupUserList.map((name, index) => (
                          <div>
                            <input value={name} className="addUserInput" onChange={
                              (e) => {
                                let userList = this.state.createGroupUserList
                                userList[index] = e.target.value
                                this.setState({
                                  createGroupUserList: userList
                                })
                              }
                            }
                              type="text" placeholder="Enter username" autoComplete="off" />
                          </div>
                        ))}
                        <button className="userListControlButton" id="userListControlButtonPlus" onClick={() => {
                          let userList = this.state.createGroupUserList
                          userList.push("")
                          this.setState({
                            createGroupUserList: userList
                          })
                        }}><FontAwesomeIcon icon={faPlus} size="lg" color="white" /></button>
                        <button className="userListControlButton" id="userListControlButtonMinus" onClick={() => {
                          let userList = this.state.createGroupUserList
                          if (userList.length > 0) {
                            userList.pop()
                            this.setState({
                              createGroupUserList: userList
                            })
                          }
                        }}><FontAwesomeIcon icon={faMinus} size="lg" color="white" /></button>
                      </div>
                    </div>
                  </div>
                ) : (<></>)}
              </div>
            </div>
            <div className="popup-footer">
              <center><button className="submitPopup" onClick={() => {
                this.createNewGroup()
                this.closeGroupPopup()
              }}>Submit</button></center>
              <span className="popupNote">*It might take a while to create the group</span>
            </div>
          </div>
        </div>
        {/* Sidenav */}
        <div id="sideNav" className="sideNav">
          <div className="sideNavButtons">
            <center>
              {/* Menu button */}
              <button id="menuButton" onClick={() => {
                if (this.state.sidenavOpen) {
                  this.setSideNav(false)
                } else {
                  this.setSideNav(true)
                }
              }}>
                <i class='fa fa-bars fa-3x'></i>
              </button>

              {/* Info button */}
              <button onClick={() => {
                window.open('https://elias.helfand.repl.co/', '_blank');
              }}><i class="fa fa-info-circle fa-3x"></i></button>
              <a onClick={this.scrollDown}>
                <div className="scrollDownDiv">
                  <div class='scrolldown'>
                    <div class="chevrons">
                      <div class='chevrondown'></div>
                      <div class='chevrondown'></div>
                    </div>
                  </div>
                </div>
              </a>
            </center>
          </div>

          <div className="menuDiv" id="menuDiv">
            {/* User settings */}
            <div className="userSettingsDiv">
              <center><span>{this.state.currentUsername}</span></center>
              <center><img id="menuPfp" src={dummypfp}/></center>
              <center>
                <button onClick={
                  () => {
                    this.setSideNav(false)
                    this.setRightSideNav(false)
                  }
                }>Profile</button>
              </center>
              <center>
                <button onClick={
                  () => {
                    auth.signOut()
                  }
                }>Logout</button>
              </center>
            </div>
            
            <div className="searchDiv">
              {/* Search public groups */}
              <div className="searchGroupDiv">
                <form class="searchGroupForm" action="#">
                  <input type="text" className="searchGroupInput" id="searchGroipInput" placeholder="Search..." autoComplete="off" />
                </form>
              </div>

              {/* Public groups list */}
              <div className="collectionList">
                <center>
                  {this.state.publicGroupList.map(({ name }) => (
                    <button className="groupChatSelectButton" onClick={
                      (e) => {
                        window.history.pushState(name, 'Title', '/' + name)
                        this.getMessages()
                      }
                    }>
                      {name}
                    </button>
                  ))}
                </center>
              </div>
            </div>

            {/* Friends */}
            <div className="friendsDiv">
              <center><span>Friends</span></center>
              <center>
                <button className="addFriendButton" onClick={
                  () => {
                    this.setSideNav(false)
                    this.setRightSideNav(false)
                    // Open popup
                  }
                }>Add friend</button>
              </center>
            </div>

            {/* Groups in which the user is in */}
            <div className="MyGroupsDiv">
              <center>
                <span>My groups</span>
              </center>

              <center>
                <button className="createNewGroupButton" onClick={
                  () => {
                    this.setSideNav(false)
                    this.setRightSideNav(false)
                    this.openGroupPopup()
                  }
                }>
                  Create new
                                </button>
              </center>

              <center>
                {
                  this.state.userGroups.map(
                    ({ name }) =>
                      (
                        <center>
                          <button className="myGroupChatSelectButton" onClick={
                            (e) => {
                              window.history.pushState(name, 'Title', '/' + name);
                              this.getMessages()
                            }
                          }>
                            {name}
                          </button>
                        </center>
                      )
                  )
                }
              </center>
            </div>

            {/* Group settings */}
            <div className="GroupSettingsDiv">
              <center><span>Members</span></center>
              <center>
                <div>
                  {
                    this.state.currentGroupPrivate == true ? this.state.memberInfoList.map(
                      ({ photoURL }) =>
                        (
                          <div class="memberImgContainer">
                            <img className="memberPfp" src={photoURL} alt="Couldn't load image"></img>
                          </div>
                        )
                    ) : (<div><center><span id="spanOnPublic">(Public)</span></center></div>)
                  }
                </div>
              </center>
            </div>
          </div>
        </div>

        {/* Right message sidenav */}
        <div id="rightSideNav" className="rightSideNav">
          <button className="rightSideNavCloseButton" onClick={() => {
            this.setRightSideNav(false)
          }}>
            <FontAwesomeIcon className="closeIcon" icon={faTimes} size="3x" color="white" />
          </button>
          <center>
            <div className={(this.state.currentMessage.uid === auth.currentUser.uid) ? 'myMessageDiv messageInfo' : 'messageDiv messageInfo'} id={(this.state.currentMessage.uid === "eKxKl6uQESeOeXvcM9LVp4IG0ta2") ? 'modMessage' : ''}>
              <img src={dummypfp} alt="Failed to load" />
              <p className="messageText">{this.state.currentMessage.text}</p>
            </div>
          </center>
          <center>
            <div className="messageInfoWrap">
              <p className="messageInfoText messageUsernameText" >User: <strong className="messageUsernameTextOnly">{this.state.currentMessage.username}</strong></p>
              <p className="messageInfoText dateText">Date: <strong>{this.state.currentMessageFormattedDate}</strong></p>
              <p className="messageInfoText timeText">Time: <strong>{this.state.currentMessageFormattedTime}</strong></p>
            </div>
          </center>
        </div>

        <div id="main">
          {/* Chat */}
          <div className="messages" id="messages">
            {this.state.messages.map(({ id, text, photoURL, uid, createdAt, messageid }) => (
              <div key={id}>
                <div className="messageDivWrapper">
                  <div className={(uid === auth.currentUser.uid) ? 'myMessageDiv' : 'messageDiv'} id={uid == "eKxKl6uQESeOeXvcM9LVp4IG0ta2" ? 'modMessage' : 'messageDivId'} onClick={() => {
                    this.getMessageInfo(messageid)
                    this.setRightSideNav(true)
                  }}>
                    <img src={dummypfp} alt="Failed to load" />
                    <p className="messageText">{text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div ref={this.scroll} className="autoScrollDiv" id="autoScrollDiv"></div>

          {/* Send message */}
          <div className="messageInputDiv">
            <form class="messageInputForm" action={() => { return false }} onSubmit={this.sendMessage}>
              <input value={this.state.msg} onChange={(e) => this.setState({ msg: e.target.value })} type="text" className="messageInput" id="messageInput" placeholder="Message..." autoComplete="off" />
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Chat