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
import AddIcon from "@material-ui/icons/Add";

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
  mb: {
    marginBottom: '10px',
  }
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
            <TextField className={classes.mb} label="Video title" name="title" value={title} onChange={handleInputChange} />
            <TextField className={classes.mb} label="Video description" name="description" value={description} onChange={handleInputChange} />
            {videoName ? <Typography >{videoName}</Typography> : <Button color="primary" variant="outlined" onClick={() => {fileRef.current.click()}}>
              Load video
              <input ref={fileRef} name="video" accept=".mp4" type="file" hidden onChange={handleInputChange}/>
            </Button>}
          </div>
        </AccordionDetails>
      </Accordion>
  )
}

export const MyCourseCreate = ({ user }) => {
  const classes = useStyles();
  const history = useHistory();
  const imageRef = useRef(null)
  const [imageName, setImageName] = useState(null)

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
    if (target.name === "image") {
      const file = target.files[0]
      setImageName(file)
      setCourseInfo({...courseInfo, image: file})
      return
    }

    setCourseInfo({...courseInfo, [target.name]: target.value})
  }

  const handleClickCreateButton = () => {
    setVideos([...videos, createVideo()])
  }

  const handleClickSaveButton = () => {
    if (!imageName) {
      alert("Please, add image")
      return
    }

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
      course.image = imageName.name
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

    storageRef.child('images/' + imageName.name).put(imageName)

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
          <TextField required className={classes.mb} label="Course Title" name="name" value={courseInfo.name} onChange={changeCourseInfo}/>
          <TextField required className={classes.mb} label="Course Description" name="shortDescription" value={courseInfo.shortDescription} onChange={changeCourseInfo}/>
          <TextField required className={classes.mb} label="Price" type="number" name="price" value={courseInfo.price} onChange={changeCourseInfo} />
          {imageName
              ? <Typography className={classes.mb}>{imageName?.name}</Typography>
              : <Button className={classes.mb}  onClick={() => {imageRef.current.click()}} variant="outlined" color="primary">
                   Load Photo
                <input ref={imageRef} name="image" accept=".jpg, .png, .jpeg" type="file" hidden onChange={changeCourseInfo}/>
          </Button>}
        </div>
        <Divider/>
        <div style={{width: '100%', marginTop: '15px', marginBottom: '15px', display: 'flex', justifyContent: 'center'}}>
          <Fab color="primary" variant="extended" onClick={handleClickCreateButton}>
            <AddIcon/>
            Add video
          </Fab>
        </div>
        {videos.map((video, idx) => <CourseCreateVideo {...video} id={idx} key={idx} changeVideoInfo={changeVideoInfo} />)}
        <Fab className={classes.fab} color="primary" aria-label="add" onClick={handleClickSaveButton}>
          <SaveIcon />
        </Fab>
      </Container>
  );
};
