import React, {useEffect, useState} from 'react';
import {Container, Fab} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import { DataGrid } from '@material-ui/data-grid';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'fixed',
    bottom: 10,
    right: 10,
  },
}));

export const MyCourses = ({user}) => {
  const classes = useStyles();
  const history = useHistory();
  const [rows, setRows] = useState([])

  const columns = [
    { field: 'id', headerName: 'ID', width: 105 },
    { field: 'title', headerName: 'Course title', width: 150 },
    { field: 'count', headerName: 'Count of purchases', width: 200 },
    { field: 'price', headerName: "Price", width: 150 },
    { field: 'total', headerName: 'Total', width: 150 }
  ];

  useEffect(() => {
    if (!user) return

    const db = firebase.firestore();
    const coursesRef =  db.collection('courses');

    coursesRef
        .where('authorId', '==', user.docId)
        .get()
        .then((snapshot) => {
          const r = []
          snapshot.forEach(course => {
            const data = course.data()
            r.push({
              id: course.id,
              title: data.name,
              count: data.count,
              price: data.price,
              total: Number(data.price) * Number(data.count),
            })

          });
          setRows([...r])
        });
  }, [user])
  //
  // const rows = [
  //   { id: 1, title: 'Snow', firstName: 'Jon', count: 35 , price: 139, total: 2000},
  //   { id: 2, title: 'Lannister', firstName: 'Cersei', count: 42 , price: 139, total: 2000},
  //   { id: 3, title: 'Lannister', firstName: 'Jaime', count: 45 , price: 139, total: 2000},
  //   { id: 4, title: 'Stark', firstName: 'Arya', count: 16 , price: 139, total: 2000},
  //   { id: 5, title: 'Targaryen', firstName: 'Daenerys', count: null , price: 139, total: 2000},
  //   { id: 6, title: 'Melisandre', firstName: null, count: 150 , price: 139, total: 2000},
  //   { id: 7, title: 'Clifford', firstName: 'Ferrara', count: 44 , price: 139, total: 2000},
  //   { id: 8, title: 'Frances', firstName: 'Rossini', count: 36 , price: 139, total: 2000},
  //   { id: 9, title: 'Roxie', firstName: 'Harvey', count: 65 , price: 139, total: 2000},
  // ];


  return (
      <Container style={{height: '100vh'}}>
        <div style={{ height: '100%', width: '100%', marginTop: 15 }}>
          <DataGrid rows={rows} columns={columns} pageSize={10}  headerHeight={60} rowHeight={40}  />
        </div>
        <Fab onClick={() => history.push('/my_courses_create')} className={classes.fab} color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </Container>
  )
};
// import * as React from 'react';
// import { DataGrid } from '@material-ui/data-grid';
//

// export default function DataTable() {
//   return (
//       <div style={{ height: 400, width: '100%' }}>
//         <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
//       </div>
//   );
// }
