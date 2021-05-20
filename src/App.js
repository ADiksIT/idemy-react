import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer, IfFirebaseAuthed,
} from "@react-firebase/auth";
import { firebaseConfig } from './firebaseConfig'
import {SignInForm} from "./components/Form";
import {Switch, BrowserRouter as Router, Route} from "react-router-dom";
import {Courses} from "./pages/Courses";
import {FirestoreProvider} from "@react-firebase/firestore";
import {Course} from "./pages/Course";
import {useState} from "react";
import {TopBar} from "./components/TopBar";
import {Profile} from "./pages/Profile";

const Routing = ({firebaseUser}) => (
    <Router>
      <div>
          <Switch>
            <Route path="/courses/:id">
              <TopBar user={firebaseUser}/>
              <Course user={firebaseUser}/>
            </Route>
            <Route path="/profile">
              <TopBar user={firebaseUser}/>
              <Profile user={firebaseUser}/>
            </Route>
            <Route path="/">
              <TopBar user={firebaseUser}/>
              <Courses/>
            </Route>
          </Switch>
      </div>
    </Router>
)


export const App = () => {
  const [firebaseUser, setFirebaseUser] = useState()

  const makeUsersDbRef = () => {
    const db = firebase.firestore()
    return db.collection("clients")
  }

  const createUser = (googleUser) => {
    const usersRef = makeUsersDbRef()

    usersRef
        .where("uid", "==", googleUser.user.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.empty) {
            usersRef.add({
              uid: googleUser.user.uid,
              purchasedCourses: [],
              coins: 0,
              displayName: googleUser.user.displayName || "Anonimus"
            })
          }
        });
  }

  const signInWithGoogle = () => {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(googleAuthProvider)
        .then(firebaseUser => createUser(firebaseUser));
  }

  const signInWithEmailAndPassword = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(firebaseUser => createUser(firebaseUser));
  }

  const signUpWithEmailAndPassword = (email, password) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(firebaseUser => createUser(firebaseUser));
  }


  return (
      <FirebaseAuthProvider {...firebaseConfig} firebase={firebase}>
        <button
          onClick={() => signInWithGoogle()}
        >
          Sign In with Google
        </button>
        <button
            onClick={() => {
              firebase.auth().signOut();
            }}
        >
          Sign Out
        </button>
        <FirestoreProvider {...firebaseConfig} firebase={firebase}>
          <FirebaseAuthConsumer>
            {({ isSignedIn }) => {
              if (!isSignedIn) {
                return <SignInForm
                        signInWithEmailAndPassword={signInWithEmailAndPassword}
                        signUpWithEmailAndPassword={signUpWithEmailAndPassword}
                />
              }
            }}

          </FirebaseAuthConsumer>
          <IfFirebaseAuthed>
             {({user}) => {
               const usersRef = makeUsersDbRef()
               usersRef
                   .where("uid", "==", user.uid)
                   .get()
                   .then((snapshot) => {
                       const docs = snapshot.docs
                        console.log(docs)
                       const data = docs[0].data()

                       if (!firebaseUser) {
                         setFirebaseUser({
                           ...data,
                           docId: docs[0].id
                         })
                       }
                   });
               return <Routing firebaseUser={firebaseUser}/>
             }}
          </IfFirebaseAuthed>
        </FirestoreProvider>
      </FirebaseAuthProvider>
  );
};
