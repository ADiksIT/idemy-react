import React from 'react';
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import {makeStyles} from "@material-ui/core/styles";


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
}));

export const MyCourseCard = ({name, image, author}) => {
  const classes = useStyles();

  return (
      <Card className={classes.root}>
        <CardMedia
            className={classes.media}
            image={image}
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
      </Card>
  );
};
