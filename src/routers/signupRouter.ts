import express from "express";
import { query } from "../db";
import { hash } from 'bcrypt';
import { validateUsername, validatePassword, validateName, validateEmail } from "../util/validatorFunc";
const router = express.Router();

const defaultScore = 800;

export default router.post("/", async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;

  console.log("/signup", { firstName, lastName, email, username, password })


  if(!firstName || !lastName || !email || !username || !password ||
    !!validateUsername(username) ||
    !!validateName(firstName) ||
    !!validateName(lastName) ||
    !!validateEmail(email) ||
    !!validatePassword(password)) {
    res.status(403).json({
      error: 'Invalid fields'
    })
    return;
  }

  query(`select * from users where username=$1 or email=$2`, username, email)
    .then(qRes => {
      if(qRes.rowCount !== 0) {
        res.status(200).json({
          error: 'Username or email already exists.'
        });
        return;
      }
    })
    .catch(err => {
      console.log(err);
      res.send(403).json({
        error: 'Error while checking if username or email exists'
      });
      return;
    })

  console.log('hash');

  let passHash;
  try {
    passHash = await hash(password, 10);
  } catch (err) {
    console.log(err);
    res.status(403).json({
      error: 'Error while preparing password.'
    })
    return;
  }

  console.log('save');

  await query(`insert into users(username, first_name, last_name, score, email, password, joined)
         values($1, $2, $3, $4, $5, $6, current_date)`,
         username, firstName, lastName, defaultScore, email, passHash)
  .then(() => {
    res.status(200).json({
      firstName,
      lastName,
      email,
      username,
      score: defaultScore
    });
  })
  .catch(err => {
    console.log(err);
    res.status(403).json({
      error: 'Error while adding user to database.'
    })
  });
})