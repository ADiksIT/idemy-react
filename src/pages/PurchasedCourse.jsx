import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {FirestoreDocument} from "@react-firebase/firestore";
import {makeStyles} from "@material-ui/core/styles";
import {CircularProgress, Container} from "@material-ui/core";
import firebase from "firebase";
import 'firebase/firestore'
import ReactPlayer from "react-player";

const useStyles = makeStyles(() => ({
  courseImage: {
    width: '100%',
    objectFit: 'fill',
  },
  root: {
    marginTop: '15px'
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  }
}))

const AccordionInfo = ({ title, description, videoLink }) => {
  const classes = useStyles();

  return (
      <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
        >
          <Typography >{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div classes={classes.column}>
            <ReactPlayer url={videoLink} width="100%" height={185} controls fallback={<span>Loading</span>}  />
            <Typography>
              {description}
            </Typography>
          </div>
        </AccordionDetails>
      </Accordion>
  )
}

const AccordionItem = ({ id, index }) => {
  console.log(id)
  const [video, setVideo] = useState("")
  const [videoLink, setVideoLink] = useState("")
  const storage = firebase.storage()

  useEffect(() => {
    if (!video) return
    console.log(video)
    storage
        .ref( `/video/${video}` )
        .getDownloadURL()
        .then( url => {
          setVideoLink(url)
          console.log(url)
        });

  }, [video, storage])

  return (
      <FirestoreDocument path={`/videos/${id}`}>
        { d => {
            if (d.isLoading) {
              return "Loading..."
            } else {
              if (d.value) {
                setVideo(d.value.name)
                return <AccordionInfo description={d.value.description} videoLink={videoLink} title={`${index + 1}. ${d.value.title}`} />
              } else {
                return <AccordionInfo description={""} title={""} videoLink={""}/>
              }
            }
          }
        }
      </FirestoreDocument>

  )
}

const HeaderCourses = ({ image, name, shortDescription }) => {
  const classes = useStyles();

  return (
    <div>
      <img className={classes.courseImage} src={image} alt={name} />
      <p>{name}</p>
      <p>{shortDescription}</p>
    </div>
  )
}

export const PurchasedCourse = () => {
  const params = useParams()
  const classes = useStyles()

  return (
    <Container className={classes.root}>
      <FirestoreDocument path={`/courses/${params.id}`}>
        {d => {
          return d.isLoading ? <CircularProgress /> : <div>
            <HeaderCourses {...d.value}/>
            {d.value?.videos.map((id, idx) => <AccordionItem id={id} key={idx} index={idx} />)}
          </div>
        }}
      </FirestoreDocument>
    </Container>
  );
};



