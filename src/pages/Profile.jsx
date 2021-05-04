import {useEffect, useState} from "react";
import {Container} from "@material-ui/core";
import {CourseProfileCard} from "../components/CourseProfileCard";
import firebase from "firebase/app";
import 'firebase/firestore';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
}));


export const Profile = ({user}) => {
  const [courses, setCourses] = useState([])
const classes = useStyles()
  useEffect(() => {
    if (!user) return

    const firestore = firebase.firestore()
    const coursesRef = firestore.collection("courses")

    firestore.collection("clients").doc(user.docId).onSnapshot(snapshot => {
      const coursesDocId = snapshot.data().purchasedCourses
      coursesRef.onSnapshot(snapshot => {
        const userCourses = snapshot.docs.filter(d => coursesDocId.includes(d.id))
        console.log(userCourses.map(d => d.data()))
        setCourses(userCourses.map(d => d.data()))
      })
    })

  }, [user])

  return (
      <div>
        <Container className={classes.container}>

          {courses.map(course => <CourseProfileCard {...course} />)}
        </Container>
      </div>
  )
};
