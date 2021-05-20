import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export const SignInForm = ({ signInWithEmailAndPassword, signUpWithEmailAndPassword }) => {
  const classes = useStyles();
  const [isSign, setIsSign] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline/>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon/>
          </Avatar>
          <Typography component="h1" variant="h5">
            {isSign ? "Sign in" : "Sign up"}
          </Typography>
          <form className={classes.form} >
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                label="Email Address"
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
            />
            <Button

                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={() => {
                  isSign
                      ? signInWithEmailAndPassword(email, password)
                      : signUpWithEmailAndPassword(email, password)
                }}
            >
              {isSign ? "Sign in" : "Sign up"}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Sign in with Google
                </Link>
              </Grid>
              <Grid item xs>
                <Link href="#" variant="body2" onClick={() => setIsSign(false)}>
                  Sign up
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
  );
}
