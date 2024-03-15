# connectSpace
connectSpace is an website social media build on Reactjs, Node.js, with database MySQL and using socket.io for real-time notifications.
# Getting Started
# Prerequisites
Before you run website, make sure you have the following installed:
1. Node.js
2. npm (Node Package Manager)
3. Mysql Workbench 
# Installation
1. Clone the repository
```bash
git clone https://github.com/ksl12/connectSpace.git
```
2. Go to the project directory and install dependencies for both the client and server
```bash
cd server
npm install
```
```bash
cd client
npm install
```
3. Create a **.env** file for client and server directories and add environment variables as shown in the **.env.example** file.
4. Start the server
```bash
cd server
npm start
```
5. Start the client
```bash
cd client
npm run dev
```
# Usage
Open your browser and navigate to  http://localhost:3001 to use connectSpace

# Features

<h3>User</h3>

- [x] Authentication and Authorization with JWT
- [x] User profile management
- [x] Post management 
- [x] Create new post with upload one image
- [x] Comment and reply in post
- [x] Like/Unlike post
- [x] Add new friend by send friend request
- [x] Delete friend
- [x] Accept/Reject friend request with notification
- [x] Suggest new friend is friend of user's friend
- [x] Search by name of user
- [x] Save post of other user
- [ ] Forgot password
- [ ] Change password
- [ ] Block/Unblock user
- [ ] Tag user 
- [ ] Create hashtag
- [ ] Search by hashtag
- [ ] Trending hashtag
- [ ] Edit post
- [ ] Send Emoji in post
- [ ] Report post
- [ ] Chat with other user

<h3>Admin</h3>

- [x] Admin dashboard
- [x] Block user
- [x] Delete post
- [ ] Search user, post
- [ ] Get list of post reported

# License
This project is licensed under the [MIT License](https://github.com/ksl12/connectSpace/blob/main/LICENSE).


