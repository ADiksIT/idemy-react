import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    marginBottom: '20px',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  courseContainer: {
    padding: '20px 20px 0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  name: {
    fontWeight: 'bold'
  },
  author: {
    fontSize: '13px',
    color: 'gray'
  },
  price: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginLeft: '10px',
  }
}));



export const CourseCard = () => {
  const classes = useStyles();
  return (
      <Card className={classes.root}>
        <CardMedia
            className={classes.media}
            image="https://img-a.udemycdn.com/course/240x135/947098_02ec_2.jpg?LG-z6PpFK6smBLvPtm1a5oHlXM6F3w43ce8k4LZyEOBt_3NMlvL5_3IRYkzikORzu1NbB0w-17zYo2l-VUZ15vB8hmf-4S94BYpV0IN-DtOAdBHNuOgNiobF_Jlx3Yk"
            title="Paella dish"
        />
        <CardContent>
          <Typography className={classes.name}>
            Understanding TypeScript - 2021 Edition
          </Typography>
          <Typography className={classes.author}>
            Google Developers
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <span className={classes.price}>
            11.99 $
          </span>
        </CardActions>
      </Card>
  )
}
