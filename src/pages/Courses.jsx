import { makeStyles } from '@material-ui/core/styles';
import {CourseCard} from "../components/CourseCard";
import {FirestoreCollection} from "@react-firebase/firestore";

const useStyles = makeStyles((theme) => ({
  courseContainer: {
    padding: '20px 20px 0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
}));

export const Courses = () => {
  const classes = useStyles();
  return (
      <div>
        <div className={classes.courseContainer}>
          <FirestoreCollection path="/courses/" >
            {response => {
              return response.isLoading ? "Loading" : response.value.map((data, idx) =>
                  <CourseCard {...data} id={response.ids[idx]} key={idx}/>)
            }}
          </FirestoreCollection>
        </div>
      </div>
  );
}
