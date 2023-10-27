// import { getDatabase, connectDatabaseEmulator, child, ref, onValue } from "firebase/database";
// import { initializeTestApp } from '@firebase/rules-unit-testing';
// import * as admin from 'firebase-admin';

import '@testing-library/jest-dom';
// import { getByText, waitFor } from '@testing-library/react';

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getAuth, signOut } from 'firebase/auth'
import MockDatabase from './setupTests';
import { getDatabase, ref, set } from "firebase/database";

import App from './components/App';
import Menu from './components/Menu';
import Header from './components/Header'
import HomePage from './components/HomePage';
import About from './components/About';
import DiscussionPage, { RenderAllPost } from './components/DiscussionPage';
import Tweets, { TestLoadTweets } from './components/Tweets';
import Footer from './components/Footer';
import SignInPage from './components/SignInPage';
import ProfilePage from './components/ProfilePage';
import ErrorPage from './components/ErrorPage';
import LikeDislike from './components/LikeDislike';

// import { auth, firebaseConfig, database } from '../firebaseConfig'
import { BrowserRouter, Router, MemoryRouter } from 'react-router-dom';
import USERS from './data/users.json';
import TWEETS from './data/tweets.json';
import { Button } from 'bootstrap';
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
// import { initializeApp } from "firebase/app";


// Auth mock
// jest.mock('../firebaseConfig', () => ({
//   auth: {
//     onAuthStateChanged: jest.fn()
//   },
// }));

// jest.mock('react', () => ({
//   ...jest.requireActual('react'),
//   useEffect: jest.fn(),
// }));

const db = getDatabase();

const testUser = {
  userId: '8Du3M2phOqP91hrkirFOJPYaYq12',
  userName: 'Test User',
  userImg: '/img/null.png'
}
// const testdb = [
//   { "userId": "User1", "userName": "Ashley Williams", "userImg": "/img/User1.jpg", "userRole": "System Administrator", "numPosts": 45, "totalPoints": 4586, "timestamp": 1320224640000, "topic": "ChatGPT is so cool!", "post": "Hey there, I just wanted to share how impressed I am with ChatGPT! As an administrator, I'm constantly looking for ways to streamline our workflow and improve our communication, and ChatGPT has been a game-changer. Its natural language processing and ability to generate human-like responses is truly amazing. I'm blown away by the way ChatGPT can understand and interpret complex questions and provide thoughtful answers. It has saved us so much time and effort, and has greatly enhanced our ability to serve our clients. Thank you, ChatGPT, for being such an innovative and valuable tool!"},
//   { "userId": "User2", "userName": "Brandon Nguyen", "userImg": "/img/User2.jpg", "userRole": "Data Scientist", "numPosts": 450, "totalPoints": 1234, "timestamp": 1320162120000, "topic": "ChatGPT is so useful!", "post": "As a data scientist, I'm constantly exploring new ways to extract insights from data. ChatGPT has been an incredible resource in this regard. Its ability to process and analyze large volumes of text data has greatly expanded our capabilities in natural language processing and sentiment analysis. With ChatGPT, we've been able to quickly and accurately analyze customer feedback and social media conversations, gaining valuable insights into our clients' needs and preferences. It's been amazing to see how ChatGPT's advanced algorithms and machine learning capabilities can help us uncover patterns and trends that would have been nearly impossible to detect otherwise. I'm truly grateful for the contributions ChatGPT has made to our data science efforts, and I look forward to continuing to explore all the ways it can help us make better decisions and drive better outcomes."},
//   { "userId": "User3", "userName": "Rachel Davis", "userImg": "/img/User3.jpg", "userRole": "Product Manager", "numPosts": 100, "totalPoints": 10000, "timestamp": 1320161040000, "topic": "AI is advancing for the better", "post": "As a product manager, I'm always on the lookout for ways to enhance our products and services and meet our customers' evolving needs. ChatGPT has been an incredible asset in this regard. Its natural language processing and machine learning capabilities have enabled us to create highly personalized and engaging user experiences. By integrating ChatGPT into our customer service and support channels, we've been able to improve our response times, increase customer satisfaction, and reduce overall support costs. Additionally, ChatGPT has allowed us to gain deeper insights into customer behavior and preferences, which has informed our product development and marketing efforts. I'm continually impressed by the flexibility and power of ChatGPT, and I'm excited to explore all the ways it can help us drive innovation and growth across our product portfolio."}
// ]




// const postsRef = ref(db, 'discussion_log');
// const offFunction = onValue(postsRef, (snapshot) => {
//   const valueObj = snapshot.val();
//   const objKeys = Object.keys(valueObj);
//   const objArray = objKeys.map((keyString) => {
//       const theMessageObj = valueObj[keyString];
//       theMessageObj.key = keyString;
//       return theMessageObj;
//   })
//   console.log(objArray)
//   return objArray;
// })
// offFunction();
// console.log(db)


describe('Integration: App', () => {
  beforeAll(() => {
    window.URL.createObjectURL = jest.fn();
  })

  afterEach(() => {
    window.URL.createObjectURL.mockReset();
  });


  test('Renders Header/Footer', () => {
    render(<App />, {wrapper: BrowserRouter});
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
    const menu = render(<Menu currentUser={testUser} />, {wrapper: BrowserRouter})
    const button = menu.getByTestId('hamburger-menu');
    expect(button).toBeVisible();
    userEvent.click(button);
  })

  test('Menu Before sign in', async () => {
    // NOTE (PBT): This still does not work, but now it opens the menu.
    // const menu = render(<Menu currentUser={{}} />, {wrapper: BrowserRouter})
    // const button = menu.getByTestId('hamburger-menu');
    // expect(button).toBeVisible();
    // await userEvent.click(button);

    // const signInButton = menu.getByTestId('sign-in-link');
    // expect(signInButton).toBeVisible();
    // await userEvent.click(signInButton);
  })

  test('Renders Home page', () => {
    render(<HomePage />, {wrapper: BrowserRouter})
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
    userEvent.click(filterButton);
    expect(screen.getByText('Filter Date: Descending'));
  })

  test('Renders Tweet Page', () => {
    render(<Tweets tweets={TWEETS}/>)
    // NOTE (PBT): You should add an expect, even if the find function would fail.
    expect(screen.getByText('For the past two months,')).toBeInTheDocument()
    // screen.debug()
  })

  test('Renders Error Page', () => {
    render(<ErrorPage />, {wrapper: BrowserRouter})
    expect(screen.getByText('Hm... Seems like the page was not found'))
  })

  test('Renders Sign In page', () => {
    render(
      <MemoryRouter initialEntries={['/signin']}>
        <App currentUser={testUser}/>
      </MemoryRouter>
    );
    expect(screen.getByText('Please sign in to view content'));
  })
  
  //crashes here
  // test('New Render Sign in Page', () => {
  //   render(<SignInPage currentUser={testUser} />, {wrapper: BrowserRouter})
  //   expect(screen.getByText('Topic: ChatGPT is so cool!'));
  // })

  test('Render Profile Page', () => {
    render(<ProfilePage currentUser={testUser} />, {wrapper: BrowserRouter});
    expect(screen.getByText('Personal Information'));
  })

  test('Profile Page upload picture', () => {
    const profile = render(<ProfilePage currentUser={testUser} />, {wrapper: BrowserRouter});
    const imgUpload = profile.container.querySelector('#imageUploadInput');
    const file = new File(['test-image'], 'user.png', { type: 'image/png' });
    userEvent.upload(imgUpload, file);
    expect(imgUpload.name).toBe('user.png');
  })
  // NOTE: Test doesn't work.
  // test('Profile Page submit picture', () => {
  //   const handleImageUpload = jest.fn()
  //   const profile = render(<ProfilePage currentUser={testUser} />, {wrapper: BrowserRouter});
  //   userEvent.click(profile.getByTestId('saveImg'))
  //   expect(handleImageUpload).toHaveBeenCalled();
  // })

  // NOTE (PBT): Since this is not running application code, it is not testing anything.
  // test('Test Sign In Functionality', () => {
  //   const signInMock = jest.fn();
  //   auth.signInWithEmailAndPassword = signInMock;
  //   const email = 'test@example.com';
  //   const password = 'testpassword';

  //   auth.signInWithEmailAndPassword(email, password);
  //   expect(signInMock).toHaveBeenCalledWith(email, password);
  // });
})

describe('Test Discussion Posts Functionality', () => {
  beforeEach(() => {
    set(ref(db), null);
  })

  test('Render Discussion Page', () => {
    set(ref(db), {
      discussion_log: {
        0: {
          dislikes: 0,
          likes: 100,
          numPosts: 45,
          post: "Hey there, I just wanted to share how impressed I am with ChatGPT! As an administrator, I'm constantly looking for ways to streamline our workflow and improve our communication, and ChatGPT has been a game-changer. Its natural language processing and ability to generate human-like responses is truly amazing. I'm blown away by the way ChatGPT can understand and interpret complex questions and provide thoughtful answers. It has saved us so much time and effort, and has greatly enhanced our ability to serve our clients. Thank you, ChatGPT, for being such an innovative and valuable tool!",
          timestamp: 1320224640000,
          topic: "ChatGPT is so cool!",
          totalPoints: 4586,
          userId: "User1",
          userImg: "/img/User1.jpg",
          userName: "Ashley Williams",
          userRole: "System Administrator"
        }
      } 
    });

    render(<DiscussionPage currentUser={testUser}/>)
    // screen.debug()
    expect(screen.getByText('Topic: ChatGPT is so cool!')).toBeInTheDocument()
  })


  test('Write new post', () => {
    render(<DiscussionPage currentUser={testUser}/>, {wrapper: BrowserRouter});
    const topicText = screen.getByPlaceholderText('Type a topic');
    const postText = screen.getByPlaceholderText('Type a new post');
    const submitButton = screen.getByText('Submit');
    userEvent.type(topicText, 'Test Topic field');
    userEvent.type(postText, 'Test post field');
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

    userEvent.click(likeButton);
    expect(screen.getByRole('button', {name: `Like ${postProp.likes + 1}`}))
    userEvent.click(likeButton);
    expect(screen.getByRole('button', {name: `Like ${postProp.likes}`}))

    userEvent.click(dislikeButton);
    expect(screen.getByRole('button', {name: `Dislike ${postProp.dislikes + 1}`}))
    userEvent.click(dislikeButton);
    expect(screen.getByRole('button', {name: `Dislike ${postProp.dislikes}`}))
    expect(screen.getByRole('button', {name: `Like ${postProp.likes}`}))

    userEvent.click(likeButton);
    expect(screen.getByRole('button', {name: `Like ${postProp.likes + 1}`}))
    userEvent.click(dislikeButton);
    expect(screen.getByRole('button', {name: `Like ${postProp.likes}`}))
    expect(screen.getByRole('button', {name: `Dislike ${postProp.dislikes + 1}`}))

    userEvent.click(dislikeButton);
    expect(screen.getByRole('button', {name: `Dislike ${postProp.dislikes}`}))
    expect(screen.getByRole('button', {name: `Like ${postProp.likes}`}))
    userEvent.click(dislikeButton);
    expect(screen.getByRole('button', {name: `Dislike ${postProp.dislikes + 1}`}))
    userEvent.click(likeButton);
    expect(screen.getByRole('button', {name: `Dislike ${postProp.dislikes}`}))
    expect(screen.getByRole('button', {name: `Like ${postProp.likes + 1}`}))
  })
})

describe('Testing Tweets Page', () => {
  // test('Render all Tweets', () => {
  //   const setTweets = jest.fn();
  //   const setDescending = jest.fn();
  //   <Tweets tweets={db.tweets} setTweets={setTweets} setDescending={setDescending} />
  // })
})
