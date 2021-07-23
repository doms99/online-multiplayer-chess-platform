import express from "express";
import { query } from "../db";
import { validatePassword, validateEmail } from "../util/validatorFunc";
import { createToken } from '../auth/tokenFuncs';
import { compare, hash } from "bcrypt";
const router = express.Router();

export default router.post("/", async (req, res) => {
  const { email: reqEmail, password: reqPass } = req.body;

  console.log("/login", { reqEmail, reqPass })

  if(!reqEmail || !reqPass || !!validateEmail(reqEmail) || !!validatePassword(reqPass)) {
    res.status(403).json({
      error: 'Invalid username or password'
    })
    return;
  }

  try {
    const result = await query('select * from users where email=$1', reqEmail);

    if(result.rowCount === 0) {
      res.status(200).json({
        error: 'Wrong username or password'
      });
      return;
    }

    const { username, first_name, last_name, email, joined, score, password } = result.rows[0];

    if(!await compare(reqPass, password)) {
      res.status(200).json({
        error: 'Wrong username or password'
      });
      return;
    }

    const token = createToken();

    const count = (await query(`select count(*) from tokens where username=$1`, username)).rows[0].count;

    if(parseInt(count, 10) !== 0) {
      await query(`delete from tokens where username=$1`, username);
    }

    await query(`insert into tokens(created, token, username) values(current_timestamp, $1, $2)`, token, username)

    res.status(200).json({
      username,
      firstName: first_name,
      lastName: last_name,
      email,
      joined,
      score,
      token
    });
  } catch(err) {
    console.log(err);
    res.status(403).json({
      error: 'Error while retrieving data from datebase'
    });
  }
})