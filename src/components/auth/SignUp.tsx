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
import { validateName, validateUsername, validatePassword, validateEmail } from "./validateFunctions";
import { FieldValue, initialFieldValue } from './constants';
import { loginActionCreator } from '../../redux/actions/auth/authAction';
import { useDispatch } from 'react-redux';
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export interface SignUpObject {
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string, 
  username: string
}

function SignUp() {
  const [firstName, setFirstName] = useState<FieldValue>(initialFieldValue);
  const [lastName, setLastName] = useState<FieldValue>(initialFieldValue);
  const [email, setEmail] = useState<FieldValue>(initialFieldValue);
  const [password, setPassword] = useState<FieldValue>(initialFieldValue);
  const [username, setUsername] = useState<FieldValue>(initialFieldValue)
  const [error, setError] = useState<string | null>(null);
  const fetch = usePost<SignUpObject>(backendURL+'/signup');
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const submit: FormEventHandler = (event: FormEvent) => {
    event.preventDefault();
    const firstNameError = validateName(firstName.value);
    const lastNameError = validateName(lastName.value);
    const usernameError = validateUsername(username.value);
    const emailError = validateEmail(email.value);
    const passwordError = validatePassword(password.value);

    setFirstName(current => ({
      ...current,
      error: firstNameError
    }));
    setLastName(current => ({
      ...current,
      error: lastNameError
    }));
    setUsername(current => ({
      ...current,
      error: usernameError
    }));
    setEmail(current => ({
      ...current,
      error: emailError
    }));
    setPassword(current => ({
      ...current,
      error: passwordError
    }));

    if(firstNameError || lastNameError || usernameError || emailError || passwordError) return;

    setError(null);
    setLoading(true);

    fetch({email: email.value, password: password.value, firstName: firstName.value, lastName: lastName.value, username: username.value})
      .then(res => {
        if(!!res.error) {
          setError(res.error);
          setEmail({value: '', error: null});
          setPassword({value: '', error: null});
          setLoading(false);
          return;
        }
        dispatch(loginActionCreator({...res, joined: new Date(res.joined)}))
        history.push('/game');
      })
      .catch(res => {
        alert(res);
        setLoading(false);
      });
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event: ChangeEvent<HTMLInputElement>) => {
    switch(event.target.id) {
      case "firstName": {
        const error = validateName(event.target.value);

        setFirstName({
          value: event.target.value,
          error
        });
        break;
      }
      case "lastName": {
        const error = validateName(event.target.value);

        setLastName({
          value: event.target.value,
          error
        });
        break;
      }
      case "username": {
        const error = validateUsername(event.target.value);

        setUsername({
          value: event.target.value,
          error
        });
        break;
      }
      case "email": {
        const error = validateEmail(event.target.value);

        setEmail({
          value: event.target.value,
          error
        });
        break;
      }
      case "password": {
        const error = validatePassword(event.target.value);

        setPassword({
          value: event.target.value,
          error
        });
        break;
      }
      default: {
        console.log("No action for id:", event.target.id);
      }
    }
  }

  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={submit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={firstName.value}
                error={!!firstName.error}
                helperText={firstName.error}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                value={lastName.value}
                error={!!lastName.error}
                helperText={lastName.error}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={username.value}
                error={!!username.error}
                helperText={username.error}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email.value}
                error={!!email.error}
                helperText={email.error}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password.value}
                error={!!password.error}
                helperText={password.error}
                autoComplete="current-password"
                onChange={handleChange}
              />
            </Grid>
          </Grid>
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
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <RouterLink to="/login">
                <Link variant="body2">
                  Already have an account? Sign in
                </Link>
              </RouterLink>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default SignUp;