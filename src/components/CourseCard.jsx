import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import {makeStyles} from "@material-ui/core/styles";
import { Redirect, useHistory } from "react-router-dom"
import {useImage} from "../hooks/Image";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    height: 340,
    marginBottom: '20px',
    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'
  },
  media: {
    width: '345px',
    height: '200px'
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

export const CourseCard = ({ price, name, image, author, id, isBuy = false }) => {
  const classes = useStyles();
  const history = useHistory();
  const url = useImage(image)

  const handleClick = () => {
    if (!isBuy) {
      history.push(`/courses/${id}`)
      return
    }

    history.push(`/purchased/${id}`)
  }

  return (
      <Card className={classes.root} onClick={handleClick}>
        <CardMedia
            className={classes.media}
            image={url}
            title={name}
        />
        <CardContent>
          <Typography className={classes.name}>
            {name}
          </Typography>
          <Typography className={classes.author}>
            {author}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          {!isBuy && <span className={classes.price}>
            {price} $
          </span>}
        </CardActions>
      </Card>
  )
}
