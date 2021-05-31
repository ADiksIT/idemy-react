import { useParams } from 'react-router-dom'
import {FirestoreDocument} from "@react-firebase/firestore";
import {Button, Container, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';

import {useEffect, useState} from "react";
import {useImage} from "../hooks/Image";


const useStyles = makeStyles(() => ({
  flex: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  shortDescription: {
    fontSize: 18
  },
  container: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    height: '300px',
    objectFit: 'cover'
  },
  button: {
    width: '100%',
    height: '60px'
  }
}));

const CoursePage = ({name, image, price, author, shortDescription, user, count, authorId, __id}) => {
  const classes = useStyles();
  const [isEnabled, setIsEnabled] = useState(false)
  const url = useImage(image)

  useEffect(() => {
    if (!user) return

    setIsEnabled(user.coins < price)
  }, [user, price])

  const buyCourse = () => {
    const db = firebase.firestore()
    const clientRef = db.collection("clients")
    const coursesRef = db.collection("courses")


    clientRef.doc(authorId).get().then(d => {
      const userData = d.data()
      clientRef.doc(authorId).update({
        coins: Number(userData.coins) + Number(price)
      })
    })

    coursesRef.doc(__id).update({
      count: count + 1
    })

    clientRef.doc(user.docId).update({
      coins: user.coins - price,
      purchasedCourses: [...user.purchasedCourses, __id]
    })

    setIsEnabled(true)
  }

  return (
      <Container >
        <div className={classes.container}>
          <img className={classes.image} src={url} alt={name}/>
          <Typography variant="h3" style={{ fontWeight: 'bold' }}>
            {name}
          </Typography>
          <p className={classes.shortDescription}>{shortDescription}</p>
          <div className={classes.flex}>
            <p>Author: {author}</p>
            <p>Price: {price} $</p>
          </div>
          <Button
              onClick={buyCourse}
              disabled={user?.purchasedCourses?.includes(__id) || isEnabled}
              variant="contained"
              className={classes.button}
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

