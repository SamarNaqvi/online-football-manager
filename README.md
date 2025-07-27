# Online Football Manager

A full-stack application to manage football teams online with features like team creation, player transfers, notifications, and more.

---

## Setup Guidelines

### Frontend

1. Navigate to the client directory:
    cd client && yarn install

2. Run the Front-end: 
    yarn dev

### Backend

1. open a new terminal and Navigate to server directory:
    cd server && yarn install

2. **Redis Setup:**
- If you have Docker Desktop, install and run the Redis Stack image:
  ```
  docker pull redis/redis-stack
  docker run -d -p 6379:6379 redis/redis-stack
  ```
- Alternatively, make sure Redis is running locally and accessible.
- You can check Redis connection via Redis CLI:
  ```
  docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
  ```

4. **Run the backend services:**

Open two separate terminals:

- Terminal 1: Start the main server
  ```
  cd server
  yarn start
  ```

- Terminal 2: open new terminal and Start the background worker
  ```
  cd server
  npx ts-node src/worker.ts
  ```

Both the server and the worker should now be running concurrently.

---

## Detailed Timeline Breakdown

| Task                                             | Time Spent        |
|-------------------------------------------------|-------------------|
| **Front-End**                                    |                   |
| - Basic Setup (Routes, State Management & Services) | 1.5 hours         |
| - Login                                          | 0.5 hour          |
| - Team Component                                 | 1 hour            |
| - Transfer List                                  | 2 hours           |
| - Overall Optimization & Improvement (Error Handling, Protected Routes, Code Splitting) | 1 hour            |
|                                                 |                   |
| **Back-End**                                     |                   |
| - Basic Setup                                    | 1 hour            |
| - Team Creation Process (including queue setup & separate process handling) | 6 hours           |
| - Buy Player (handling edge cases)               | 1.5 hours         |
| - Firebase Setup for Messaging                    | 1 hour            |
| - Update Player                                  | 0.5 hour          |
|                                                 |                   |
| **Integration (Front-End & Back-End)**           | 1 day             |

---

## Additional Notes

- Ensure Redis is running before starting the backend services, as the worker depends on Redis queues.
- Use `yarn` or `npm` consistently as your package manager to avoid conflicts.
- To stop the services, you can safely terminate the terminals where the server and worker are running.

