import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import {useEffect, useState} from "react";
import ReactPlayer from "react-player";
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    height: 400,
    marginBottom: '20px',
  },
  name: {
    fontWeight: 'bold'
  },
}));


export const CourseProfileCard = ({ name, video, author, id }) => {
  const classes = useStyles();
  const [videoLink, setVideoLink] = useState("")
  const storage = firebase.storage()

  useEffect(() => {
    if (!video) return

    storage
        .ref( `/video/${video}` )
        .getDownloadURL()
        .then( url => {
          setVideoLink(url)
          console.log( "Got download url: ", url );
        });

  }, [video, storage])


  return (
      <div className={classes.root} >
        <ReactPlayer url={videoLink} width={350} height={400} controls fallback={<span>Loading</span>}  />
        <Typography className={classes.name}>
          {name}
        </Typography>
      </div>
  )
}
