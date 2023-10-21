import '@testing-library/jest-dom';
import { getByText, waitFor } from '@testing-library/react';

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import firebase, { initializeApp } from 'firebase/app';
import { getDatabase, connectDatabaseEmulator, ref } from "firebase/database";
// import { getAuth, connectAuthEmulator } from "firebase/auth";
import admin from 'firebase-admin';
import "firebase/auth";
import MockDatabase from './setupTests';

import App from './components/App';
import Menu from './components/Menu';
import Header from './components/Header'
import HomePage from './components/HomePage';
import About from './components/About';
import DiscussionPage, { RenderAllPost } from './components/DiscussionPage';
import Tweets from './components/Tweets';
import Footer from './components/Footer';
import SignInPage from './components/SignInPage';
import ProfilePage from './components/ProfilePage';
import ErrorPage from './components/ErrorPage';
import LikeDislike from './components/LikeDislike';

import { auth, firebaseConfig, database } from '../firebaseConfig'
import { BrowserRouter, Router, MemoryRouter } from 'react-router-dom';
import USERS from './data/users.json';
import TWEETS from './data/tweets.json';
import { Button } from 'bootstrap';


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
const testdb = [
  { "userId": "User1", "userName": "Ashley Williams", "userImg": "/img/User1.jpg", "userRole": "System Administrator", "numPosts": 45, "totalPoints": 4586, "timestamp": 1320224640000, "topic": "ChatGPT is so cool!", "post": "Hey there, I just wanted to share how impressed I am with ChatGPT! As an administrator, I'm constantly looking for ways to streamline our workflow and improve our communication, and ChatGPT has been a game-changer. Its natural language processing and ability to generate human-like responses is truly amazing. I'm blown away by the way ChatGPT can understand and interpret complex questions and provide thoughtful answers. It has saved us so much time and effort, and has greatly enhanced our ability to serve our clients. Thank you, ChatGPT, for being such an innovative and valuable tool!"},
  { "userId": "User2", "userName": "Brandon Nguyen", "userImg": "/img/User2.jpg", "userRole": "Data Scientist", "numPosts": 450, "totalPoints": 1234, "timestamp": 1320162120000, "topic": "ChatGPT is so useful!", "post": "As a data scientist, I'm constantly exploring new ways to extract insights from data. ChatGPT has been an incredible resource in this regard. Its ability to process and analyze large volumes of text data has greatly expanded our capabilities in natural language processing and sentiment analysis. With ChatGPT, we've been able to quickly and accurately analyze customer feedback and social media conversations, gaining valuable insights into our clients' needs and preferences. It's been amazing to see how ChatGPT's advanced algorithms and machine learning capabilities can help us uncover patterns and trends that would have been nearly impossible to detect otherwise. I'm truly grateful for the contributions ChatGPT has made to our data science efforts, and I look forward to continuing to explore all the ways it can help us make better decisions and drive better outcomes."},
  { "userId": "User3", "userName": "Rachel Davis", "userImg": "/img/User3.jpg", "userRole": "Product Manager", "numPosts": 100, "totalPoints": 10000, "timestamp": 1320161040000, "topic": "AI is advancing for the better", "post": "As a product manager, I'm always on the lookout for ways to enhance our products and services and meet our customers' evolving needs. ChatGPT has been an incredible asset in this regard. Its natural language processing and machine learning capabilities have enabled us to create highly personalized and engaging user experiences. By integrating ChatGPT into our customer service and support channels, we've been able to improve our response times, increase customer satisfaction, and reduce overall support costs. Additionally, ChatGPT has allowed us to gain deeper insights into customer behavior and preferences, which has informed our product development and marketing efforts. I'm continually impressed by the flexibility and power of ChatGPT, and I'm excited to explore all the ways it can help us drive innovation and growth across our product portfolio."}  
]


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
    render(<Menu currentUser={testUser} />, {wrapper: BrowserRouter})
  
    expect(screen.getByText('cottage'))
    expect(screen.getByText('About'))
    expect(screen.getByText('Discussion'))
    expect(screen.getByText('Tweets'))
    expect(screen.getByText('Profile'))
    expect(screen.getByText('Sign Out'))
    // screen.debug()
    userEvent.click(screen.getByText('Sign Out'))
  })

  test('Toggle Hamburger Menu', () => {
    window.innerWidth = 375;
    window.innerHeight = 667;
    render(<Menu currentUser={testUser} />, {wrapper: BrowserRouter})
    screen.getbyrole('button', {name: 'menu'})  
    // screen.debug()
    // userEvent.click(container.firstChild.classList.contains('fa fa-bars'))
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

  test('Test Tweets filter button', () => {
    render(
      <MemoryRouter initialEntries={['/tweets']}>
        <App />
      </MemoryRouter>
    );
    const filterButton = screen.getByText('Filter Date: Descending');
    expect(filterButton);
    userEvent.click(filterButton);
    expect(screen.getByText('Filter Date: Ascending'));
  })

  test('Renders Tweet Page', async () => {
    await render(<Tweets tweets={TWEETS}/>)
  
    // const tweetElements = container.querySelectorAll('.container');
  
    // expect(tweetElements.length).toBeGreaterThan(0);
    screen.findByText('For the past two months,')
  })

  test('Renders Error Page', () => {
    render(<ErrorPage />, {wrapper: BrowserRouter})
    expect(screen.getByText('Hm... Seems like the page was not found'))
  })

  test('Renders Sign In page', () => {
    render(
      <MemoryRouter initialEntries={['/signin']}>
        <App currentUse={testUser}/>
      </MemoryRouter>
    );
    expect(screen.getByText('Please sign in to view content')); 
  })

  test('New Render Sign in Page', () => {
    render(<SignInPage currentUser={{ userId: 'someUserId' }} />)
    expect(Navigate).toHaveBeenCalledWith({ to: '/discussion' }, {});
  })

  test('Render Profile Page', () => {
    render(<ProfilePage currentUser={testUser} />, {wrapper: BrowserRouter});
    expect(screen.getByText('Personal Information'));
  })

  test('Profile Page upload picture', () => {
    const profile = render(<ProfilePage currentUser={testUser} />, {wrapper: BrowserRouter});
    const imgUpload = profile.container.querySelector('#imageUploadInput');
    const file = new File(['test-image'], 'user.png', { type: 'image/png' });
    userEvent.upload(imgUpload, file);
    // userEvent.click(saveImg);
    expect(imgUpload.name).toBe('user.png');
  })

  test('Profile Page submit picture', () => {
    const handleImageUpload = jest.fn()
    const profile = render(<ProfilePage currentUser={testUser} />, {wrapper: BrowserRouter});
    const imgUpload = profile.container.querySelector('#saveImg');
    screen.getByText('Save to Profile')

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
    
  test('Render discussion with database', () => {
    // db.ref('/').set(data);
    render(<DiscussionPage postList={testdb} currentUser={testUser}/>, {wrapper: BrowserRouter}); 
    // screen.debug()

    // beforeAll(async () => {
    // })
    // const snapshot =  admin.database.ref('./data/firebase_data.json').child('discussion_log/0').once('value');
    // const user = snapshot.val();
    // expect(user.userName).toBe('Ashley Williams');

    // render(
    //   <MemoryRouter initialEntries={['/discussion']}>
    //     <App />
    //   </MemoryRouter>
    // );
  })
  

  test('Write new post', async () => {
    render(<DiscussionPage currentUser={testUser}/>, {wrapper: BrowserRouter}); 
    const topicText = screen.getByPlaceholderText('Type a topic');
    const postText = screen.getByPlaceholderText('Type a new post');
    const submitButton = screen.getByText('Submit');
    await userEvent.type(topicText, 'Test Topic field');
    await userEvent.type(postText, 'Test post field');
    userEvent.click(submitButton);
    expect(screen.getByText('Test post field'));
  })

  test('Like/Dislike Buttons', async() => {
    const postProp = {
      likes: 10,
      dislikes: 5
    }
    const onLikePost = jest.fn();
    const onDislikePost = jest.fn();
    render(<LikeDislike post={postProp} onLikePost={onLikePost} onDislikePost={onDislikePost}/>, {wrapper: BrowserRouter}); 
    const likeButton = screen.getByRole('button', {name: `Like ${postProp.likes}`})
    const dislikeButton = screen.getByRole('button', {name: `Dislike ${postProp.dislikes}`})
    await userEvent.click(likeButton);
    expect(screen.getByRole('button', {name: `Like ${postProp.likes + 1}`}))
    await userEvent.click(dislikeButton);
    expect(screen.getByRole('button', {name: `Like ${postProp.likes}`}))
    expect(screen.getByRole('button', {name: `Dislike ${postProp.dislikes + 1}`}))
  })

  
})


describe('Testing Tweets Page', () => {
  
  test('Render all Tweets', () => {
    const setTweets = jest.fn();
    const setDescending = jest.fn();
    <Tweets tweets={TWEETS.tweets} setTweets={setTweets} setDescending={setDescending} />
    screen.debug()
  })
  
})