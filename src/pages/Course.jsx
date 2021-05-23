import { useParams } from 'react-router-dom'
import {FirestoreDocument} from "@react-firebase/firestore";
import {Button, Container, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';

import {useEffect, useState} from "react";


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

const CoursePage = ({name, image, price, author, shortDescription, user, __id}) => {
  const classes = useStyles();
  const [isEnabled, setIsEnabled] = useState(false)

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
      <Container >
        <div className={classes.container}>
          <img className={classes.image} src={image} alt={name}/>
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

