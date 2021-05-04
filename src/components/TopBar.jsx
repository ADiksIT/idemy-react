import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import {FirestoreDocument} from "@react-firebase/firestore";
import {LibraryAdd} from "@material-ui/icons";
import {useHistory} from "react-router-dom";


const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  flex: {
    display: 'flex',
    alignItems: 'center'
  },
  logo: {
    width: '50px',
    marginRight: '10px',
    objectFit: "cover"
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
}));

export const TopBar = ({user}) => {
  const classes = useStyles();
  const history = useHistory();

  const renderMenu = (
      <Menu
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem >Profile</MenuItem>
        <MenuItem >My account</MenuItem>
      </Menu>
  );

  return (
      <div className={classes.grow}>
        <AppBar position="static">
          <Toolbar>
            <div className={classes.flex}>
              <img className={classes.logo} src="data:image/png;base64,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" alt=""/>
              <Typography className={classes.title} variant="h6" noWrap>
                Idemy
              </Typography>
            </div>
            <div className={classes.grow} />
            <div>
              {/*<IconButton aria-label="show 17 new notifications" color="inherit">*/}
              {/*  <Badge badgeContent={17} color="secondary">*/}
              {/*    <LibraryAdd />*/}
              {/*  </Badge>*/}
              {/*</IconButton>*/}
              <FirestoreDocument path={`/clients/${user?.docId}`}>
                {res => (
                    res.isLoading ? "Loading" : <span>{res?.value?.coins}</span>
                )}
              </FirestoreDocument>
              <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  color="inherit"
                  onClick={() => history.push('/profile')}
              >
                <AccountCircle />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMenu}
      </div>
  );
}
