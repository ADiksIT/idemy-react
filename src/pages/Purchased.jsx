import {useEffect, useState} from "react";
import {Container} from "@material-ui/core";
import {CourseProfileCard} from "../components/CourseProfileCard";
import firebase from "firebase/app";
import 'firebase/firestore';
import {makeStyles} from "@material-ui/core/styles";
import {CourseCard} from "../components/CourseCard";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '20px 20px 0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
}));


export const Purchased = ({user}) => {
  const [courses, setCourses] = useState([])
  const [coursesId, setCoursesId] = useState([])

  const classes = useStyles()

  useEffect(() => {
    if (!user) return

    const firestore = firebase.firestore()
    const coursesRef = firestore.collection("courses")

    firestore.collection("clients").doc(user.docId).onSnapshot(snapshot => {
      const coursesDocId = snapshot.data().purchasedCourses
      setCoursesId(coursesDocId)
      coursesRef.onSnapshot(snapshot => {
        const userCourses = snapshot.docs.filter(d => coursesDocId.includes(d.id))
        setCourses(userCourses.map(d => d.data()))
      })
    })

  }, [user])

  return (
      <div>
        <Container className={classes.container}>
          {courses.map((course, id) =>
              <CourseCard
                  price={course.price}
                  image={course.image}
                  author={course.author}
                  name={course.name}
                  id={coursesId[id]}
                  isBuy={true}
              />)
          }
        </Container>
      </div>
  )
};