# Donezo Full Stack Application

# Donezo Full Stack Application

# Todo List Application with Authentication

This project is a full-featured Todo List web application built with React, providing user authentication alongside comprehensive todo management functionality. Users can sign up, log in, and then create, view, complete, and delete todos. The app leverages modern React libraries and best practices to deliver a smooth and responsive user experience.

## Features

- **User Authentication**:  
  - **Sign Up**: New users can register an account.  
  - **Log In**: Existing users can authenticate and gain access to their personal todo lists. Due to this being an assignment, the appropriate credentials I provide to my instructors work effectively and points you directly to the todo section. 
  - Authentication integrates smoothly to gate access to the todos section.

- **Todo Management**:  
  - Create todos with a title and description.  
  - View a personalized list of todos after logging in.  
  - Mark todos as completed with a toggle checkbox.  
  - Delete todos with a confirmation prompt.  

- **UI & UX Enhancements**:  
  - Modal dialog for adding new todos.  
  - Toast notifications for success and error feedback on all actions.  
  - Smooth fade-in and hover animations for todo items.  
  - Responsive layout using Tailwind CSS.  
  - Loading and error states handled gracefully.

## Technologies Used

- **React** — for the UI.  
- **React Query (@tanstack/react-query)** — for data fetching, caching, and server state management.  
- **React Hook Form** — to handle forms efficiently.  
- **Axios** — HTTP client with a custom instance for API requests.  
- **React Toastify** — for toast notifications.  
- **Tailwind CSS** — for styling and layout.  
- **Backend API** — REST endpoints for authentication and todo CRUD operations.

## Application Flow

1. **Authentication**:  
   Users begin by signing up or logging in. Successful login authenticates the user and routes them to their Todo List page.

2. **Todos CRUD**:  
   Once logged in, users can:  
   - See their existing todos fetched from the backend.  
   - Add new todos via a modal form.  
   - Toggle completion status.  
   - Delete todos with confirmation.  
   
   All actions trigger backend API calls, with React Query managing data consistency and cache invalidation.

3. **User Feedback & UI**:  
   Toast notifications inform users of successful or failed operations. The todo list items animate subtly for a polished experience.

## Getting Started

1. **Backend**  
   Ensure the backend API is running locally and supports:  
   - User registration and login endpoints.  
   - Todo CRUD endpoints protected by authentication.  

2. **Frontend Setup**  
   - Clone the repo.  
   - Run `npm install` or `yarn` to install dependencies.  
   - Start the app with `npm start` or `yarn start`.  
   - Access via `http://localhost:3000`.  

3. **Testing**  
   Use provided instructor credentials or register new users to test login and access the todos page.

## Backend API Endpoints (Expected)

- **Authentication**  
  - `POST /auth/signup` — Register new user  
  - `POST /auth/login` — User login, returns auth token/session  

- **Todos** (Authenticated)  
  - `GET /todos` — Fetch user’s todos  
  - `POST /todos` — Create a new todo  
  - `PUT /todos/:id/completed` — Toggle completion  
  - `DELETE /todos/:id` — Delete a todo  

## Future Directions

- Enhance authentication with features like password reset, social login, and session persistence.  
- Add todo editing capability.  
- Implement filtering (completed, active) and search within todos.  
- Add pagination or infinite scrolling for large todo lists.  
- Improve accessibility and mobile responsiveness.  
- Enhance animations and UI polish further.

---

This project showcases how to integrate user authentication with a fully functional, animated, and responsive Todo List app using React, React Query, and React Hook Form, all backed by a REST API. It’s a solid foundation for building scalable, user-centric React applications.


## Backend

The backend is very simple. It connects to Supabase using Prisma (which is allowed and (documented)[https://supabase.com/partners/integrations/prisma] how to do).
There is no authentication being handled here, only Authorization.

For more information on the backend, please look at the README in the backend folder 


## Frontend

The frontend is a React Single Page Application. It connects to Supabase via it's Authentication service and does have a Supabase Client initialized.

For more information on the frontend, please look at the readme in the frontend folder
