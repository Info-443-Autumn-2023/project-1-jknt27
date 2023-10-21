import '@testing-library/jest-dom';
import { getByText, waitFor } from '@testing-library/react';

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import firebase, { initializeApp } from 'firebase/app';
import { getDatabase, connectDatabaseEmulator, ref } from "firebase/database";
// import { getAuth, connectAuthEmulator } from "firebase/auth";
import admin from 'firebase-admin';
import "firebase/auth";
import './setupTests'


import App from './components/App';
import Menu from './components/Menu';
import Header from './components/Header'
import HomePage from './components/HomePage';
import About from './components/About';
import DiscussionPage from './components/DiscussionPage';
import Tweets from './components/Tweets';
import Footer from './components/Footer';
import SignInPage from './components/SignInPage';
import ProfilePage from './components/ProfilePage';
import ErrorPage from './components/ErrorPage';

import { auth, firebaseConfig, database } from '../firebaseConfig'
import { BrowserRouter, Router, MemoryRouter } from 'react-router-dom';
import USERS from './data/users.json';
import TWEETS from './data/tweets.json';


// Auth mock
jest.mock('../firebaseConfig', () => ({
  auth: {
    onAuthStateChanged: jest.fn()
  },
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
}));

const testUser = {
  userId: '8Du3M2phOqP91hrkirFOJPYaYq12',
  userName: 'Test User',
  userImg: '/img/null.png'
}


describe('Integration: App', () => {
  
  test('Renders Header/Footer', () => {
    render(<App />, {wrapper: BrowserRouter}); 
    // expect(window.location.pathname).toBe('/');
    // expect(window.location.pathname).toBe('/home');
    expect(screen.getByText('ChatGPT: A Brief Rendition'));
    expect(screen.getByText('email@chatgpt.uw.edu')); 
  })
  
  test('Render Menu (User signed in)', () => {
    render(<Menu currentUser={testUser} />, {wrapper: BrowserRouter})
  
    expect(screen.getByText('cottage'))
    expect(screen.getByText('About'))
    expect(screen.getByText('Discussion'))
    expect(screen.getByText('Tweets'))
    expect(screen.getByText('Profile'))
    expect(screen.getByText('Sign Out'))
  })

  test('Render Menu (User signed out)', () => {
    // const auth = getAuth();
    // connectAuthEmulator(auth, "http://127.0.0.1:9099");
    // render(<Menu currentUser={testUser} />, {wrapper: BrowserRouter})
  
    // expect(screen.getByText('cottage'))
    // expect(screen.getByText('About'))
    // expect(screen.getByText('Discussion'))
    // expect(screen.getByText('Tweets'))
    // expect(screen.getByText('Profile'))
    // expect(screen.getByText('Sign Out'))
    // // screen.debug()
    // userEvent.click(screen.getByText('Sign Out'))
  })

  test('Renders Home page', () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <App />
      </MemoryRouter>
    );
  
    // Initial render should show the home page
    expect(screen.getByText('What is ChatGPT?')); 
  })

  test('Renders About page', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('About why we should care (In Depth)')); 

  })
  
  test('Renders Discussion page', () => {    
    render(<DiscussionPage currentUser={testUser}/>)

    expect(screen.getByText('Posting as: Test User')); 
  })

  test('Renders Tweets page', () => {
    render(
      <MemoryRouter initialEntries={['/tweets']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Filter Date: Descending')); 
  })

  test('Renders Error Page', () => {
    render(<ErrorPage />, {wrapper: BrowserRouter})
    expect(screen.getByText('Hm... Seems like the page was not found'))
  })

  test('Renders Sign In page', () => {
    // render(
    //   <MemoryRouter initialEntries={['/signin']}>
    //     <App />
    //   </MemoryRouter>
    // );
    // expect(screen.getByText('Please sign in to view content')); 
  })

  test('Render Profile Page', () => {
    // render(<ProfilePage currentUse={testUser} />, {wrapper: BrowserRouter});
    // expect(screen.getByText('Personal Information'));
  })

  test('Test Sign In Functionality', () => {
    const signInMock = jest.fn();
    auth.signInWithEmailAndPassword = signInMock;
    const email = 'test@example.com';
    const password = 'testpassword';
  
    auth.signInWithEmailAndPassword(email, password);
    expect(signInMock).toHaveBeenCalledWith(email, password);
  });
  
  // test('Test Sign Out Functionality', () => {
  //   const signOutMock = jest.fn();
  //   auth.signOut = signOutMock;
  
  //   auth.signOut();
  
  //   expect(signOutMock).toHaveBeenCalled();
  // });

})

describe('Test Discussion Posts Functionality', () => {
  // const app = firebase.initializeApp(firebaseConfig);
//   const db = getDatabase();
// if (window.location.hostname === "localhost") {
//  //can only run this once per "instance" though??
//  connectDatabaseEmulator(db, "localhost", 9000); //use emulator
// }
  
  // beforeEach(() => {
  //   fetchMock.resetMocks()
  // })
  // beforeAll(async () => {
  //   await database.ref().set('./data/firebase_data.json')
  // })

  const data = './data/firebase_data.json';
  const db = database;

  test('Render discussion with database', async () => {
    db.ref('/').set(data);
    // render(<DiscussionPage currentUser={testUser}/>, {wrapper: BrowserRouter}); 
    // screen.debug()

    // beforeAll(async () => {
    // })
    // const snapshot =  admin.database.ref('./data/firebase_data.json').child('discussion_log/0').once('value');
    // const user = snapshot.val();
    expect(user.userName).toBe('Ashley Williams');
  })
})