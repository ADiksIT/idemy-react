import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
  IfFirebaseAuthed,
  IfFirebaseAuthedAnd
} from "@react-firebase/auth";
import { firebaseConfig } from './firebaseConfig'
import {SignInForm} from "./components/Form";
import {Switch, BrowserRouter as Router, Route} from "react-router-dom";
import {Courses} from "./pages/Courses";
import {FirestoreProvider} from "@react-firebase/firestore";

const Routing = () => (
    <Router>
      <div>
          <Switch>
            <Route path="/courses/:id">
              course id
            </Route>
            <Route path="/profile">
              profile
            </Route>
            <Route path="/">
              <Courses/>
            </Route>
          </Switch>
      </div>
    </Router>
)

export const App = () => {
  return (
      <FirebaseAuthProvider {...firebaseConfig} firebase={firebase}>
        <FirestoreProvider {...firebaseConfig} firebase={firebase}>
          <FirebaseAuthConsumer>
            {({ isSignedIn }) => {
              return !isSignedIn ? <Routing/> : <SignInForm/>
            }}
          </FirebaseAuthConsumer>
        </FirestoreProvider>
      </FirebaseAuthProvider>
  );
};
