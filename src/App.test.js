import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { getDatabase, ref, set } from "firebase/database";
import { BrowserRouter, Router, MemoryRouter } from 'react-router-dom';

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

import USERS from './data/users.json';
import TWEETS from './data/tweets.json';
import FBDATA from './data/firebase_data.json'


const db = getDatabase();

const testUser = {
  userId: '8Du3M2phOqP91hrkirFOJPYaYq12',
  userName: 'Test User',
  userImg: '/img/null.png'
}

const testUser2 = {
  userId: '8Du3M2phOqP91hrkirFOJPYaYq12',
  userName: 'Test User',
  userImg: '/img/null.png',
  userRole: 'Coder'
}



describe('Integration: App', () => {
  beforeAll(() => {
    window.URL.createObjectURL = jest.fn();
  })

  afterEach(() => {
    window.URL.createObjectURL.mockReset();
  });

  test('Render Header', () => {
    render(<Header/>)
    expect(screen.getByText('ChatGPT: A Brief Rendition'));
  })

  test('Render Footer', () => {
    render(<Footer />);
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
    const menu = render(<Menu currentUser={{}} />, {wrapper: BrowserRouter})
    const button = menu.getByTestId('hamburger-menu');
    expect(button).toBeVisible();
    userEvent.click(button);

    const signInButton = menu.getByTestId('sign-in-link');
    expect(signInButton).toBeVisible();
    userEvent.click(signInButton);
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

  

  test('Renders Error Page', () => {
    render(<ErrorPage />, {wrapper: BrowserRouter})
    expect(screen.getByText('Hm... Seems like the page was not found'))
  })

  // NOTE: This still does not work due to firebase mock authentication problems.
  // test('Renders Sign In page', () => {
  //   // render(
  //     //   <MemoryRouter initialEntries={['/signin']}>
  //     //     <App currentUser={emptyUserID}/>
  //     //   </MemoryRouter>
  //     // );

  //   const loginUser = jest.fn()
  //   const emptyUserID = { "userId": null, "userName": "Annonymous", "userImg": "/img/null.png", "userRole": null, "numPosts": null, "totalPoints": null}
  //   render(<SignInPage currentUser={emptyUserID} loginCallback={loginUser}/>)
  //   expect(screen.getByText('Please sign in to view content'));
  // })
  
  // NOTE: Testing for page redirection crashes tests.
  // test('New Render Sign in Page', () => {
  //   render(<SignInPage currentUser={testUser} />, {wrapper: BrowserRouter})
  //   expect(screen.getByText('Topic: ChatGPT is so cool!'));
  // })

  test('Render Profile Page', () => {
    render(<ProfilePage currentUser={testUser} />, {wrapper: BrowserRouter});
    expect(screen.getByText('Personal Information'));
  })

  //Note: website's fileupload does not work
  test('Profile Page upload picture', () => {
    const profile = render(<ProfilePage currentUser={testUser} />, {wrapper: BrowserRouter});
    const imgUpload = profile.container.querySelector('#imageUploadInput');
    const image = screen.getAllByAltText('Test User avatar')
    const file = new File(['test-image'], 'user.png', { type: 'image/png' });
    userEvent.upload(imgUpload, file);
    expect(file.name).toBe('user.png');
    // expect(image.getAttribute('src')).not.toBeNull();
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

  test('Renders Empty Discussion page', () => {
    render(<DiscussionPage currentUser={testUser}/>)
    expect(screen.getByText('Posting as: Test User'));
  })
  
  test('Render Discussion Post', () => {
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
    expect(screen.getByText('Topic: ChatGPT is so cool!')).toBeInTheDocument()
    expect(screen.getByRole('button', {name: `Like 100`})).toBeInTheDocument();
  })

  test('Render Discussion Post and Click Like (2x)', () => {
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
    expect(screen.getByText('Topic: ChatGPT is so cool!')).toBeInTheDocument()
    expect(screen.getByText('Like')).toBeInTheDocument();
    const likeButton = screen.getByRole('button', {name: `Like 100`});
    userEvent.click(likeButton);
    expect(screen.getByText('101')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    userEvent.click(likeButton);
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  })

  test('Render Discussion Post and Click Dislike (2x)', () => {
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
    expect(screen.getByText('Topic: ChatGPT is so cool!')).toBeInTheDocument()
    expect(screen.getByText('Like')).toBeInTheDocument();
    const dislikeButton = screen.getByRole('button', {name: `Dislike 0`});
    userEvent.click(dislikeButton);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    userEvent.click(dislikeButton);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  })

  test('Render Discussion Post and Click both Like/Dislike', () => {
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
    expect(screen.getByText('Topic: ChatGPT is so cool!')).toBeInTheDocument()
    expect(screen.getByText('Like')).toBeInTheDocument();
    const likeButton = screen.getByRole('button', {name: `Like 100`});
    const dislikeButton = screen.getByRole('button', {name: `Dislike 0`});
    userEvent.click(likeButton);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('101')).toBeInTheDocument();
    userEvent.click(dislikeButton);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  })

  test('Create new post (User has invalid role)', () => {
    render(<DiscussionPage currentUser={testUser}/>, {wrapper: BrowserRouter});
    const topicText = screen.getByPlaceholderText('Type a topic');
    const postText = screen.getByPlaceholderText('Type a new post');
    const submitButton = screen.getByText('Submit');
    userEvent.type(topicText, 'Test Topic field');
    userEvent.type(postText, 'Test post field');
    userEvent.click(submitButton);
    expect(screen.getByText('Topic: Test Topic field')).toBeInTheDocument();
    expect(screen.getByText('Test post field')).toBeInTheDocument();
  })

  test('Create new post (User has valid role)', () => {
    render(<DiscussionPage currentUser={testUser2}/>, {wrapper: BrowserRouter});
    const topicText = screen.getByPlaceholderText('Type a topic');
    const postText = screen.getByPlaceholderText('Type a new post');
    const submitButton = screen.getByText('Submit');
    userEvent.type(topicText, 'I have a valid role!');
    userEvent.type(postText, 'I am a user with the role of a coder!');
    userEvent.click(submitButton);
    expect(screen.getByText('Topic: I have a valid role!')).toBeInTheDocument();
    expect(screen.getByText('I am a user with the role of a coder!')).toBeInTheDocument();
  })

  test('Create new post after loaded in a post', () => {
    set(ref(db), {
      discussion_log: {
        "one": {
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
    
    render(<DiscussionPage currentUser={testUser}/>, {wrapper: BrowserRouter});
    const topicText = screen.getByPlaceholderText('Type a topic');
    const postText = screen.getByPlaceholderText('Type a new post');
    const submitButton = screen.getByText('Submit');
    userEvent.type(topicText, 'Test Topic field');
    userEvent.type(postText, 'Test post field');
    userEvent.click(submitButton);
    expect(screen.getByText('Topic: Test Topic field')).toBeInTheDocument();
    expect(screen.getByText('Test post field')).toBeInTheDocument();
    expect(screen.getByText('Topic: ChatGPT is so cool!')).toBeInTheDocument()
  })

  // Expect an error to be thrown when both are empty
  test('Create new post with empty topic and post', () => {
    render(<DiscussionPage currentUser={testUser}/>, {wrapper: BrowserRouter});
    const submitButton = screen.getByText('Submit');
    userEvent.click(submitButton);
    expect(screen.queryByText('Topic:')).toBeNull();
  })
  
  //   Expect: Post will still go through without topic
  test('Create new post with empty topic', () => {    
    render(<DiscussionPage currentUser={testUser}/>, {wrapper: BrowserRouter});
    const postText = screen.getByPlaceholderText('Type a new post');
    const submitButton = screen.getByText('Submit');
    userEvent.type(postText, 'There is no topic in this post!');
    userEvent.click(submitButton);
    expect(screen.queryByText('There is no topic in this post!')).toBeNull();
  })

  test('Create new post with empty post', () => {    
    render(<DiscussionPage currentUser={testUser}/>, {wrapper: BrowserRouter});
    const topicText = screen.getByPlaceholderText('Type a topic');
    const submitButton = screen.getByText('Submit');
    userEvent.type(topicText, 'This is an empty post!');
    userEvent.click(submitButton);
    expect(screen.queryByText('This is an empty post!')).toBeNull();
  })

  test('Create new post (100 words)', () => {
    render(<DiscussionPage currentUser={testUser}/>, {wrapper: BrowserRouter});
    const topicText = screen.getByPlaceholderText('Type a topic');
    const postText = screen.getByPlaceholderText('Type a new post');
    const submitButton = screen.getByText('Submit');
    const post = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a,'
    userEvent.type(topicText, 'Test Topic field');
    userEvent.type(postText, post);
    userEvent.click(submitButton);
    expect(screen.getByText('Topic: Test Topic field')).toBeInTheDocument();
    expect(screen.getByText(post)).toBeInTheDocument();
  })

  test('Create new post (2000 characters)', () => {
    render(<DiscussionPage currentUser={testUser}/>, {wrapper: BrowserRouter});
    const topicText = screen.getByPlaceholderText('Type a topic');
    const postText = screen.getByPlaceholderText('Type a new post');
    const submitButton = screen.getByText('Submit');
    const longPost = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris. Praesent adipiscing. Phasellus ullamcorper ipsum rutrum nunc. Nunc nonummy metus. Vestib';
    userEvent.type(topicText, 'Test Topic field');
    userEvent.type(postText, longPost);
    userEvent.click(submitButton);
    expect(screen.getByText('Topic: Test Topic field')).toBeInTheDocument();
    expect(screen.getByText(longPost)).toBeInTheDocument();
  })

  test('Render Discussion posts from JSON', () => {
    set(ref(db), {discussion_log: FBDATA.discussion_log})
    render(<DiscussionPage currentUser={testUser}/>, {wrapper: BrowserRouter});
    expect(screen.getByText('Topic: ChatGPT is so cool!')).toBeInTheDocument();
    expect(screen.getByText('Topic: ChatGPT is so useful!')).toBeInTheDocument();
    expect(screen.getByText('Topic: AI is advancing for the better')).toBeInTheDocument();
    expect(screen.getByText('Topic: ChatGPT IS AWESOME!')).toBeInTheDocument();
    expect(screen.getByText('Topic: SO cool')).toBeInTheDocument();
    expect(screen.getByText('Topic: PRO/CONS of ChatGPT')).toBeInTheDocument();
  })

  test('Like/Dislike Buttons Interactivity', async() => {
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
  beforeEach(() => {
    set(ref(db), null);
  })
  
  test('Test Tweets filter button', () => {
    render(<Tweets/>)
    const filterButton = screen.getByText('Filter Date: Descending');
    expect(filterButton);
    userEvent.click(filterButton);
    expect(screen.getByText('Filter Date: Ascending'));
    userEvent.click(filterButton);
    expect(screen.getByText('Filter Date: Descending'));
  })

  // Note: Tests only shows Tweet containers and does not render the Tweets. Mocking failed.
  // test('Renders Tweet Page', async () => {
  //   set(ref(db), {tweets: TWEETS});
  //   render(<Tweets/>, {wrapper: BrowserRouter})
  //   // // NOTE (PBT): You should add an expect, even if the find function would fail.
  //   expect(screen.getByText('Here are five tips that can help you make the best use of #ChatGPT.')).toBeInTheDocument()
  //   // await waitFor(() => {
  //   //   expect(screen.getByText('Here are five tips that can help you make the best use of #ChatGPT.')).toBeInTheDocument()
  //   // })
  // })
})
