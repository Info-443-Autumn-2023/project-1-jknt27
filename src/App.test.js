import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { initializeApp } from "firebase/app";

import App from "./components/App";
import { auth, firebaseConfig } from '../firebaseConfig'
import { BrowserRouter } from "react-router-dom";
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

describe("Integration:App", () => {
  
  test("Renders App without errors", async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    ); 

    expect(screen.getByText("ChatGPT: A Brief Rendition")).toBeInTheDocument(); 
  })

  test('User Sign In', async () => {
    jest.mock('../firebaseConfig', () => ({
      auth: {
        onAuthStateChanged: jest.fn()
      },
    }));
    const signInMock = jest.fn();
    auth.signInWithEmailAndPassword = signInMock;
    const email = 'test@example.com';
    const password = 'testpassword';
  
    auth.signInWithEmailAndPassword(email, password);
    expect(signInMock).toHaveBeenCalledWith(email, password);
  });
  
  test('User Sign Out', async () => {
    const signOutMock = jest.fn();
    auth.signOut = signOutMock;
  
    auth.signOut();
  
    expect(signOutMock).toHaveBeenCalled();
  });


})