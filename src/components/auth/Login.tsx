import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { ChangeEvent, ChangeEventHandler, FormEvent, FormEventHandler, useState } from 'react';
import { validateEmail, validatePassword } from "./validateFunctions";
import { FieldValue, initialFieldValue } from './constants';
import validator from 'validator';
import { useDispatch } from 'react-redux';
import { loginActionCreator } from '../../redux/actions/auth/authAction';
import { usePost } from '../game/hooks/useFetch';
import { backendURL } from '../../constants';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        ChessMaster
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

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
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export interface SignInObject {
  email: string, 
  password: string
}

function SignIn() {
  const [email, setEmail] = useState<FieldValue>(initialFieldValue);
  const [password, setPassword] = useState<FieldValue>(initialFieldValue);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fetch = usePost<SignInObject>(backendURL+'/login');
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const submit: FormEventHandler = (event: FormEvent) => {
    event.preventDefault();

    const emailError = validateEmail(email.value);
    const passwordError = validatePassword(password.value);

    setEmail(current => ({
      ...current,
      error: emailError
    }));
    setPassword(current => ({
      ...current,
      error: passwordError
    }));

    if(!!emailError || !!passwordError ) return;
    
    setError(null);
    setLoading(true);

    fetch({email: email.value, password: password.value})
      .then(res => {
        if(!!res.error) {
          setError(res.error);
          setEmail({value: '', error: null});
          setPassword({value: '', error: null});
          setLoading(false);
          return;
        }
        dispatch(loginActionCreator({...res, joined: new Date(res.joined)}));
        history.push('/game');
      })
      .catch(res => {
        alert(res);
        setLoading(false);
      });
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event: ChangeEvent<HTMLInputElement>) => {
    switch(event.target.id) {
      case "email": {
        const error = validateEmail(event.target.value);

        setEmail({
          value: event.target.value.trim(),
          error
        });
        break;
      }
      case "password": {
        setPassword({
          value: event.target.value,
          error: validator.isEmpty(event.target.value) ? "Password can't be empty" : null
        });
        break;
      }
      default: {
        console.log("No action for id:", event.target.id);
      }
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form className={classes.form} noValidate onSubmit={submit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email.value}
            error={!!email.error}
            helperText={email.error}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password.value}
            error={!!password.error}
            helperText={password.error}
            onChange={handleChange}
          />
          {error && (
            <Typography color="error" align="center">{error}</Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}
          >
            login
          </Button>
          <Grid container>
            <Grid item xs>
            </Grid>
            <Grid item>
              <RouterLink to="/signup" >
                <Link variant="body2">
                  Don't have an account? Sign Up
                </Link>
              </RouterLink>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default SignIn;