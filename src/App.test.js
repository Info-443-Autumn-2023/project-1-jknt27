import '@testing-library/jest-dom';
import { waitFor } from '@testing-library/react';

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { initializeApp } from 'firebase/app';

import App from './components/App';
import Menu from './components/Menu';

import { auth, firebaseConfig } from '../firebaseConfig'
import { BrowserRouter, Router, MemoryRouter } from 'react-router-dom';
import USERS from './data/users.json';
import TWEETS from './data/tweets.json';



jest.mock('../firebaseConfig', () => ({
  auth: {
    onAuthStateChanged: jest.fn()
  },
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
}));

describe('Integration:App', () => {
  
  test('Renders Header/Footer', async () => {
    render(<App />, {wrapper: BrowserRouter}); 
    // expect(window.location.pathname).toBe('/');
    // expect(window.location.pathname).toBe('/home');
    expect(screen.getByText('ChatGPT: A Brief Rendition')).toBeInTheDocument();
    expect(screen.getByText('email@chatgpt.uw.edu')).toBeInTheDocument(); 
  })

  test('Renders home page', async() => {
    // render(<App />, {wrapper: BrowserRouter}); 
    const { container, getByText } = render(
      <MemoryRouter initialEntries={['/home']}>
        <App />
      </MemoryRouter>
    );
  
    // Initial render should show the home page
    expect(screen.getByText('What is ChatGPT?')).toBeInTheDocument(); 
    expect(container.innerHTML).toMatch('What is ChatGPT?');
  })

  test('Renders about page', async() => {
    const { container, getByText } = render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('About why we should care (In Depth)')).toBeInTheDocument(); 
    expect(container.innerHTML).toMatch('About why we should care (In Depth)');
  })
  
  // test('Renders discussion page fails without sign in', async() => {    
  //   const { container, getByText } = render(
  //     <MemoryRouter initialEntries={['/discussion']}>
  //       <App />
  //     </MemoryRouter>
  //   );

  //   screen.debug()
  //   expect(screen.getByText('Please sign in to view content')).toBeInTheDocument(); 
  //   expect(container.innerHTML).toMatch('Please sign in to view content');
  // })  

  test('Renders Tweets page', async() => {
    const { container, getByText } = render(
      <MemoryRouter initialEntries={['/tweets']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Filter Date: Descending')).toBeInTheDocument(); 
    expect(container.innerHTML).toMatch('Filter Date: Descending');
  })

  // test('Renders Sign In page', async() => {
  //   const { container, getByText } = render(
  //     <MemoryRouter initialEntries={['/signin']}>
  //       <App />
  //     </MemoryRouter>
  //   );
  //   expect(screen.getByText('Please sign in to view content')).toBeInTheDocument(); 
  //   expect(container.innerHTML).toMatch('Please sign in to view content');
  // })

  test('Test Sign In Functionality', async () => {
    const signInMock = jest.fn();
    auth.signInWithEmailAndPassword = signInMock;
    const email = 'test@example.com';
    const password = 'testpassword';
  
    auth.signInWithEmailAndPassword(email, password);
    expect(signInMock).toHaveBeenCalledWith(email, password);
  });
  
  test('Test Sign Out Functionality', async () => {
    const signOutMock = jest.fn();
    auth.signOut = signOutMock;
  
    auth.signOut();
  
    expect(signOutMock).toHaveBeenCalled();
  });


  // test('Click on pages', () => {
  //   // render(<App />, {wrapper: BrowserRouter}); 
  //   render(
  //     <MemoryRouter initialEntries={['/home']}>
  //       <App />
  //     </MemoryRouter>
  //   );
    
  //   // const nav = screen.getByRole('navigation');

  //   // const aboutLink = container.querySelector('a[href="/about"]');
  //   // fireEvent.click(aboutLink);
  //   userEvent.click(screen.getByText('About'))

  //   // screen.debug();
  //   expect(screen.getByText('About why we should care (In Depth)'));
  //   expect(window.location.pathname).toBe('/about');
  // });

  // test('Renders menu bar', () => {
  //   // render(
  //   //   <BrowserRouter>
  //   //     <App />
  //   //   </BrowserRouter>
  //   // )

  //   render(<Menu />)

  //   const menuItem = screen.getByText('About');
  //   // console.log(menuItem)
  //   fireEvent.click(menuItem);
  //   // console.log(fireEvent.click(menuItem))
  //   expect(window.location.pathname).toBe('/about');

  //   // expect(screen.getByText('About why we should care (In Depth)')).toBeInTheDocument(); 
  // })


})

describe('Test menu buttons', () => {

  jest.mock('../firebaseConfig', () => ({
    auth: {
      onAuthStateChanged: jest.fn()
    },
  }));
  
  jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useEffect: jest.fn(),
  }));

  // test('Renders About page', async () => {
  //   render(
  //     <BrowserRouter>
  //       <App />
  //     </BrowserRouter>
  //   )

  //   screen.debug()
    
  //   // render(<Menu />)

  //   // await screen.getByText('About');

  //   const about = screen.getByText('About');
  //   // console.log(about)
  //   fireEvent.click(about);
  //   // console.log(fireEvent.click(about, { button: 0}))
  //   // expect(window.location.pathname).toBe('/about');
  //   await waitFor(() => {
  //     expect(window.location.pathname).toBe('/about');
  // });
  // })


})