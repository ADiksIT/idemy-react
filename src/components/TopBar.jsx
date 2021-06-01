import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {FirestoreDocument} from "@react-firebase/firestore";
import {useHistory} from "react-router-dom";
import { ExitToAppRounded } from '@material-ui/icons';
import firebase from "firebase/app"
import 'firebase/auth';
import React from "react"
import {useState} from "react";


const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  flex: {
    display: 'flex',
    alignItems: 'center'
  },
  logo: {
    width: '30px',
    marginRight: '10px',
    objectFit: "cover",
    borderRadius:'50%',
    cursor: 'pointer'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  userName: {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  width: '10px'
  },
  menu: {
    backgroundColor: 'gray'
  }
}));

export const TopBar = ({user}) => {
  const classes = useStyles();
  const history = useHistory();
  const [isOpenMenu, setIsOpenMenu] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClose = () => {
    setAnchorEl(null);
    setIsOpenMenu(false)
  }

  const handleOpen = () => {
    setIsOpenMenu(true)
  }

  const handleClickPurchasedCourses = () => {
    handleClose()
    history.push('/purchased')
  }

  const handleClickMyCourses = () => {
    handleClose()
    history.push('/my_courses')
  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
      <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          id={menuId}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isOpenMenu}
          onClose={handleClose}
      >
        <MenuItem onClick={handleClickMyCourses}>My course</MenuItem>
        <MenuItem onClick={handleClickPurchasedCourses}>Purchased course</MenuItem>
        <FirestoreDocument path={`/clients/${user?.docId}`}>
          {res => (
              res.isLoading ? "Loading" : <>
                <MenuItem disabled>Coins: {res?.value?.coins?.toFixed(2)}</MenuItem>
                <MenuItem disabled>{res?.value?.displayName}</MenuItem>
              </>
          )}
        </FirestoreDocument>
      </Menu>
  );

  return (
      <div className={classes.grow}>
        <AppBar position="static">
          <Toolbar>
            <div className={classes.flex} onClick={() => history.push('/')}>
              <img className={classes.logo} src="/img/idemy.jpg" alt=""/>
              <Typography className={classes.title} variant="h6" noWrap>
                Idemy
              </Typography>
            </div>
            <div className={classes.grow} />
            <div className={classes.flex}>
              <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  color="inherit"
                  onClick={(event) => {
                    setAnchorEl(event.currentTarget);
                    handleOpen()
                  }}
              >
                <AccountCircle />
              </IconButton>
              <IconButton onClick={() => firebase.auth().signOut()} >
                <ExitToAppRounded color={"secondary"}/>
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMenu}
      </div>
  );
}
