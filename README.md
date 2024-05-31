# Collabarative Code Editor
* multiple users can join a room for simultaneous editing in realtime.
* single user creates a room.
* user who created/joined the room can share the room ID for invite.

## Tech Stack
* websockets used for realtime data streaming.
* React used in frontend and Node.js in backend.
* react-hot-toast used for notification.
* uuid library for generating random long string for using as Room ID.
* main code Editor is done using Monaco Editor and used postMessage API to make it collaborative
* the link in iframe is the code editor. The github link for that is "https://github.com/CyanXshadow/codeEditor".

## Instructions
### Development
* cd client && npm start (on terminal 1)
* cd server && npm run server (on terminal 2)

### Production
* first add the env variable value to platform used for deployment of client code.
* use "REACT_APP_WEB_SOCKET_URL" key name and assign server code production url as value.
* in client, run "npm run build/npm run start" for test run.
* in deployment platform for client code, select the client as "root folder".
