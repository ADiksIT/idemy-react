import { makeStyles } from '@material-ui/core/styles';
import {CourseCard} from "../components/CourseCard";
import {FirestoreCollection} from "@react-firebase/firestore";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
  courseContainer: {
    width: '96%%',
    paddingTop: '15px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
}));

export const Courses = () => {
  const classes = useStyles();
  return (
      <Container className={classes.courseContainer}>
          <FirestoreCollection path="/courses/" >
            {response => {
              return response.isLoading ? "Loading" : response.value.map((data, idx) =>
                  <CourseCard {...data} id={response.ids[idx]} key={idx}/>)
            }}
          </FirestoreCollection>
      </Container>
  );
}
