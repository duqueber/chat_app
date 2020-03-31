# NatChat

### Instruction to start NatChat
1. Start the front-end server
```
cd ./front-end/server
```
```
npm install
```
```
npm start
```

2. Start the front-end client
```
cd ./front-end/client
```
```
npm install
```
```
npm start
```

3. Start service user-management
```
cd ./user-management
```
```
npm install
```
```
npm start
```
### Use NatChat

1. Go to localhost:3000
2. Type user name. Right now there are 3 users accounts in the db - user1, user2, and user3. You need to use one of these users for the chat to work. 
3. One of your friends needs to be connected so you can message! user1, user2 and user3 are friends with eachother so you need to login with at least two users.
4. Once you see a friend connected (on the right side of the chat) click on it and now you can send a message!
5. If you want to reply to a message, you MUST click the user you are replying to.

#### Step by step example

1. Open two tabs and go to localhost:3000, tab1 and tab2
2. Type "user1" to login in tab1 and type "user2" to login in tab2.
3. Click on "user2" in tab1, type a message and click send. The message should appear on tab1 and tab2. 
4. From tab2, click on "user1", type a message and click send. The message should appear on tab2 and tab1.

### Design and implementation

#### Flow
- "user1" joins NatChat and informs other users. Other users request user-management to retrieve their friends lists. If "user1" is a friend, "user1" is added to the right of the screen.
- "user1" clicks on one of his friends for the first time. This action creates a room and asks his friend to join the same room. A room list is kept in the server side with all its members.
- "user1" sends a message to his friend. Friend responds to message by clicking "user1." Friend and "user1" have already joined the room, so this action is not required. 

#### UI
React (personal note: I have limited exposure to UI development. I pretty much make UI changes when backend changes require them. You said not to spend too much time in UI but out of all possible options I had, React is the one I'm most familiar with... However, lots of the issues I spent time with were caused by my inexperience. Also, there are a couple of UI components and css classes I borrowed from a source code base online. I put then in the folders with the label "borrowed");

#### Service: user-management
user-managment is a service with an api interface that manages user-related functions. This project only needs one api to get a user object but other apis should be implemented here. For example, add a user, update a user, delete a user etc

#### DB
I hard-coded the user accounts. 

### What NatChat is missing.

- You can only have a conversation between two users: "user3" cannot be added to the conversation between "user1" and "user3"
- There is not history management: when a user refreshes or leaves, messages are lost. There should be a service that manages messages so a number of messages can be stored in a db. When user refreshes or leaves, message should be stored and the retrieve from the service. 
- There is no user authentication: there is no password verification or third-party authentication provider to authenticate users.
- There is no api authentication: front-end user the user-management api to get the friends of an user from the db. user-managemt does not have any authentication requirements (e.g. token gotten with an api key and secret).
- There is no load balancing in the case of needing to support lots of rooms: rooms need to be distributed into more that one socket in the case of high demand. 
- There is no centralized logging.
- There is no testing: functional testing is needed as well as load testing.
- There is no session management.
- Build and deployment process should be managed.
- There are lots of ui elements missing:
  - It does not change rooms in the ui: "user1" and "user2" are exchanging messages but "user1" decided that he wants to  message "user3" now. He can, but messages will show up in the same screen as messages between "user1" and "user2."
  - There is no user management: "user1" cannot add more friends or configure profile.
 
 ### Known bugs
 
  - You can only have a conversation between two users: "user3" cannot be added to the conversation between "user1" and "user3"
  - Send button is active even when you haven't chosen a user to send a message to.
  - Issues with the logic when a user leaves a room. If "user1" is sending messages to "user2" and leaves the room, when "user1" comes back and wants to send messages to "user2" sometime, he can't. 
