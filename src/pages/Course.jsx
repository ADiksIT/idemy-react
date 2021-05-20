import { useParams } from 'react-router-dom'
import {FirestoreDocument} from "@react-firebase/firestore";
import {Button, Container, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';

import {useEffect, useState} from "react";
import ReactPlayer from "react-player";

const useStyles = makeStyles((theme) => ({
  shortDescription: {
    fontSize: 18
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: "center",
  }
}));

const CoursePage = ({name, image, price, author, shortDescription, video, user, __id}) => {
  const classes = useStyles();
  const storage = firebase.storage()
  const [videoLink, setVideoLink] = useState("")
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    if (!video) return

    storage
        .ref( `/video/${video}` )
        .getDownloadURL()
        .then( url => {
          setVideoLink(url)
          console.log( "Got download url: ", url );
        });

  }, [video, storage])

  useEffect(() => {
    if (!user) return

    setIsEnabled(user.coins < price)
  }, [user, price])

  const buyCourse = () => {
    const db = firebase.firestore()
    const clientRef = db.collection("clients")

    clientRef.doc(user.docId).update({
      coins: user.coins - price,
      purchasedCourses: [...user.purchasedCourses, __id]
    })

    setIsEnabled(true)
  }

  return (
      <Container className={classes.container}>
        <div>
          <Typography variant="h2" style={{ fontWeight: 'bold' }}>
            {name}
          </Typography>
          <p className={classes.shortDescription}>{shortDescription}</p>
          <p>{price} $</p>
          <p>{author}</p>
          <Button
              onClick={buyCourse}
              disabled={user?.purchasedCourses?.includes(__id) || isEnabled}
              variant="contained"
              color="primary"
          >
            {user?.purchasedCourses?.includes(__id) ? "Already purchased" : "Buy for coins"}
          </Button>
        </div>
      </Container>
  )
}

export const Course = ({user}) => {
  const params = useParams()
  return (
      <div>
        <FirestoreDocument path={`/courses/${params.id}`}>
          {d => {
            return d.isLoading ? "Loading" : <CoursePage {...d.value} user={user}/>
          }}
        </FirestoreDocument>
      </div>
  )
};

