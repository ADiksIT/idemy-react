import { makeStyles } from '@material-ui/core/styles';
import { TopBar } from '../components/TopBar'
import {CourseCard} from "../components/CourseCard";

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
  const arr = [1,2,3,4,5,6,7,8,9,10]
  return (
      <div>
        <TopBar/>
        <div className={classes.courseContainer}>
          {arr.map(_ => <CourseCard/>)}
        </div>
      </div>
  );
}
