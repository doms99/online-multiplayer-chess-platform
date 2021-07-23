import validator from 'validator';

export const validateName = (value: string): string | null => {
  let error = null;
  if(validator.isEmpty(value, {ignore_whitespace: true}))
    error = "First name can't be empty";
  else if(!validator.isAlpha(value))
    error = "First name contains unsupported characters"

  return error;
}

export const validateUsername = (value: string): string | null => {
  let error = null;
  if(validator.isEmpty(value, {ignore_whitespace: true}))
    error = "Username can't be empty";
  else if(!validator.isAlphanumeric(value))
    error = "Username contains unsupported characters"

  return error;
}

export const validateEmail = (value: string): string | null => {
  let error = null;
  if(validator.isEmpty(value, {ignore_whitespace: true}))
    error = "Email can't be empty";
  else if(!validator.isEmail(value))
    error = "Provided value is not an email"

  return error;
}

export const validatePassword = (value: string): string | null => {
  let error = null;
  if(validator.isEmpty(value, {ignore_whitespace: true}))
    error = "Password can't be empty";
  else if(value.length > 50)
    error = "Pasword can't be longer then 50 characters;"
  else if(!validator.isStrongPassword(value, { minLowercase: 1, minUppercase: 0, minLength: 8, minSymbols: 0 }))
    error = "Password must be at least 8 characters long, contain at least 1 number and letter"

  return error;
}