# Getting Started with the project 
Develop environment: 
- OS: Windows 10 
- Node version: v20.10.0
- Frontend: React JS with Ant Design
- Backend: Node.js
- Database: MongoDB Cluster
- Responsive: yes

# Branch to use: 
- Use master branch as the main branch

# Backend: 
- require node version 16.20.1 and above
- Execute steps below in VS code terminal: 
1. cd backend
2. use yarn install to get the dependencies
3. use node main.js to start the server

note: Manually change the device DNS (IPV4) to 8.8.8.8 if not able to connect to the MongoDB server

# Frontend: 
- require node version 18.12.0 and above
- Execute steps below in VS code terminal: 
1. cd frontend
2. use yarn install to get the dependencies
3. START the server first to makesure it can retrieve the data from DB
3. use yarn start to start the project interface

# Features: 
1. Task Listing - select Manage Task at the side menu
2. Add new Task - use Add button at top right
3. View Task details - click on one of the row to view specific details
4. Edit the task (update status, priority, due date... etc.) - select edit in details, click save to save changes
5. Delete the task - click the delete button at the end of each row
6. Sorting task - Soft by priority & filter by status (use this at top of each column)

## Disclaimer
This project is created solely for the purpose of a technical test and may not represent a complete or fully functional application. It is intended to showcase technical skills and proficiency with the specified technologies. Any resemblance to real projects, products, or services is purely coincidental.