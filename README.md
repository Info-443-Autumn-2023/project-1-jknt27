# ChatGPT: A Brief Rendition
## By: Harold Pham, Vivian Hung, Joseph Tran, Muyang Zhou

Hello! This repository contains code for the interactive web app we built for INFO 340: *(Client-Side Web Development)* at the University of Washington Information School in Winter 2023. This is a React app built with the intention of introducing ChatGPT and the emergence of other Large Language Models (LLM).

Our site can be found [here](https://chatgpt-a-brief-rendition.web.app/home).


## Checkpoint 2 Diagrams
![Checkpoint 2 Class Diagram](./images/codebase_structure.jpg)

![Checkpoint 2 Process Flow Diagram](./images/process_flow.jpg)


**Checkpoint 2: Optional Element**

I would analyze the architectural quality of the discussion posts page write unit tests for that.


## Checkpoint 3: Testing

I am currently working on debugging the Firebase Emulator Suite, which is necessary for testing the database component of my application. Here is the current test coverage report.

![Checkpoint 3 Test Coverage](./images/CurrentTestCoverage.png)

To execute my tests, please run `npm test App.test.js -- --coverage --collectCoverageFrom='src/components/*.js'`.