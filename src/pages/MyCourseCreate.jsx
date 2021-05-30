import React, {useRef, useState} from 'react';
import {Backdrop, Button, CircularProgress, Container, Divider, Fab, TextField} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import SaveIcon from '@material-ui/icons/Save';

import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  column: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  fab: {
    position: 'fixed',
    bottom: 10,
    right: 10,
  },
  backdrop: {
    zIndex: 999,
    color: '#fff',
  },
}));

const CourseCreateVideo = ({title, description, id, changeVideoInfo}) => {
  const classes = useStyles();
  const fileRef = useRef(null)
  const [videoName, setVideoName] = useState("")

  const handleInputChange = (event) => {
    changeVideoInfo(event, id)
    if (event.target.name === "video") {
        const file = event.target.files[0]
        setVideoName(file.name)
    }
  }

  return (
      <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
        >
          <Typography >{id}. {title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={classes.column}>
            {videoName ? videoName : <Button color="primary" onClick={() => {fileRef.current.click()}}>
              Load video
              <input ref={fileRef} name="video" accept=".mp4" type="file" hidden onChange={handleInputChange}/>
            </Button>}
            <TextField label="Video title" name="title" value={title} onChange={handleInputChange} />
            <TextField label="Video description" name="description" value={description} onChange={handleInputChange} />
          </div>
        </AccordionDetails>
      </Accordion>
  )
}

export const MyCourseCreate = ({ user }) => {
  const classes = useStyles();
  const history = useHistory();

  const [videos, setVideos] = useState([])
  const [courseInfo, setCourseInfo] = useState({
    image: "",
    name: "",
    shortDescription: "",
    price: 0,
    videos: [],
    author: "",
    authorUID: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  const createVideo = () => ({
    video: null,
    title: "",
    description: "",
  })

  const changeCourseInfo = ({target}) => {
    setCourseInfo({...courseInfo, [target.name]: target.value})
  }

  const handleClickCreateButton = () => {
    setVideos([...videos, createVideo()])
  }

  const handleClickSaveButton = () => {
    const db = firebase.firestore()
    const storage = firebase.storage()

    const videosRef = db.collection("videos")
    const coursesRef = db.collection("courses")
    const clientsRef = db.collection("clients")

    const storageRef = storage.ref()

    const videosNormalizeData = videos.map((v) => ({
      title: v.title,
      description: v.description,
      name: v.video.name
    }))

    const videosNormalizeDataPromises = videosNormalizeData.map(v => videosRef.add(v))
    setIsLoading(true)
    Promise.all(videosNormalizeDataPromises).then(values => {
      const videoIds = values.map(v => v.id)

      const course = courseInfo
      course.videos = videoIds
      course.author = user.displayName
      course.authorId = user.docId
      course.count = 0

      coursesRef.add(course).then(v => {
        clientsRef.doc(user.docId).get().then(d => {
          const userData = d.data()
          clientsRef.doc(user.docId).update({
            myCourse: [...userData.myCourse, v.id]
          })
        })
      })
    })

    const videoFiles = videos.map((v) => v.video)

    const videosPromise = videoFiles.map(video => storageRef.child('video/' + video.name).put(video))
    Promise.all(videosPromise).then(values => {
      setIsLoading(false)
      alert("Course was successfully uploaded")
      history.push('/')
    }).catch(e => {
      setIsLoading(false)
      alert(e.message)
    });
  }

  const changeVideoInfo = ({target}, id) => {
    if (target.name === "video") {
      videos[id][target.name] = target.files[0]
      setVideos([...videos])
      return
    }
    videos[id][target.name] = target.value
    setVideos([...videos])
  }

  return (
      <Container style={{marginTop: 15}}>
        <Backdrop className={classes.backdrop} open={isLoading} >
          <CircularProgress color="inherit" />
        </Backdrop>
        <div className={classes.column}>
          <TextField label="Course Title" name="name" value={courseInfo.name} onChange={changeCourseInfo}/>
          <TextField label="Course Description" name="shortDescription" value={courseInfo.shortDescription} onChange={changeCourseInfo}/>
          <TextField label="Image course link" name="image" value={courseInfo.image} onChange={changeCourseInfo}/>
          <TextField label="Price" type="number" name="price" value={courseInfo.price} onChange={changeCourseInfo}/>
        </div>
        <Divider/>
        <Button onClick={handleClickCreateButton}>Add video</Button>
        {videos.map((video, idx) => <CourseCreateVideo {...video} id={idx} key={idx} changeVideoInfo={changeVideoInfo} />)}
        <Fab className={classes.fab} color="primary" aria-label="add" onClick={handleClickSaveButton}>
          <SaveIcon />
        </Fab>
      </Container>
  );
};
