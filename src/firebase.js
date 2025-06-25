import {initializeApp} from 'firebase/app';
import {getDatabase} from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCEECI77ntnlxpMcD8nFRobGnkxOyHGi_4",
  authDomain: "chat-project-c94de.firebaseapp.com",
  databaseURL: "https://chat-project-c94de-default-rtdb.firebaseio.com",
  projectId: "chat-project-c94de",
  storageBucket: "chat-project-c94de.firebasestorage.app",
  messagingSenderId: "902897383658",
  appId: "1:902897383658:web:2ff2e7ceb8a09d748f7f93",
  measurementId: "G-ZW48DLS6YC"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export {app, database};
