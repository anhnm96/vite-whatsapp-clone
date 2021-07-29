import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyBw3_AC_u3zgok-kkYAaLVWX6-W95aqbq4',
  authDomain: 'whatsapp-clone-a0797.firebaseapp.com',
  projectId: 'whatsapp-clone-a0797',
  storageBucket: 'whatsapp-clone-a0797.appspot.com',
  messagingSenderId: '456582331102',
  appId: '1:456582331102:web:65bce2018d9c68f31e204f',
}
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig)

const db = firebaseApp.firestore()
const auth = firebaseApp.auth()
const provider = new firebase.auth.GoogleAuthProvider()
const storage = firebase.storage().ref('images')
const audioStorage = firebase.storage().ref('audios')
const createTimestamp = firebase.firestore.FieldValue.serverTimestamp
const serverTimestamp = firebase.database.ServerValue.TIMESTAMP

export {
  firebase,
  db,
  auth,
  provider,
  storage,
  audioStorage,
  createTimestamp,
  serverTimestamp,
}
