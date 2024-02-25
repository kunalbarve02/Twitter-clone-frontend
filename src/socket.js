import { io } from 'socket.io-client'
const socket_connection = io("ws://localhost:5000/")
export default socket_connection