import React, {useEffect} from 'react';
import firebase from 'firebase/app';
import 'firebase/storage';

export const useImage = (imageName) => {
  const [url, setUrl] = React.useState("")

  useEffect(() => {
    if (!imageName) return

    const storage = firebase.storage()

    storage
        .ref( `/images/${imageName}` )
        .getDownloadURL()
        .then( url => {
          setUrl(url)
          console.log( "Got download url: ", url );
        });
  }, [imageName])

  return url
};
