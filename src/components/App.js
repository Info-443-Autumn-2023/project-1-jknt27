import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import Menu from './Menu';
import Header from './Header'
import HomePage from './HomePage';
import About from './About';
import DiscussionPage from './DiscussionPage';
import Tweets from './Tweets';
import Footer from './Footer';
import SignInPage from './SignInPage';
import ProfilePage from './ProfilePage';
import ErrorPage from './ErrorPage';

import USERS from '../data/users.json';
import TWEETS from '../data/tweets.json';

export default function App(props) {
  const [currentUser, setCurrentUser] = useState(USERS[0]);
  const [tweets, setTweets] = useState(TWEETS);
  const navigateTo = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        firebaseUser.userId = firebaseUser.uid;
        firebaseUser.userName = firebaseUser.displayName;
        firebaseUser.userImg = firebaseUser.photoURL || "/img/null.png";
        setCurrentUser(firebaseUser);
      }
      else {
        setCurrentUser(USERS[0]);
      }
    })

  }, [])

  const loginUser = (userObj) => {
    setCurrentUser(userObj);

    if (userObj.userId !== null) {
      navigateTo('/discussion');
    }
  }

  return (
    <div className='ChatGPTaBriefRendition'>
      <Menu currentUser={currentUser} />
      <Header />
      <Routes>
        <Route path='' element={<Navigate to='/home' />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/about' element={<About />} />
        <Route path='/tweets' element={<Tweets tweets={tweets} />}/>
        <Route path='/signin' element={<SignInPage currentUser={currentUser} loginCallback={loginUser} />} />
        <Route path='*' element={<ErrorPage />} />
        <Route element={<ProtectedPages currentUser={currentUser} />}>
          <Route path='/discussion' element={<DiscussionPage currentUser={currentUser} />} />
          <Route path="/profile" element={<ProfilePage currentUser={currentUser} />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
}

function ProtectedPages(props) {
  if (props.currentUser.userId === null) {
    return <Navigate to='/signin' />
  }
  else {
    return <Outlet />
  }
}
