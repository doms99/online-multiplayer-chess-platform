import { RequestHandler, Request } from "express";
import { query } from "../db";
import { randomBytes } from 'crypto';

const tokenDuration = 172800000;

export const tokenCheck: RequestHandler = async (req, res, next) => {
  const header = req.headers.authorization;
  const token = header && header.split(' ')[1];

  if (token == null) {
    res.status(401).send("No token");
    return;
  }

  try {
    const auth = (await query(`SELECT username, created FROM tokens WHERE token = $1`, token));
    if(auth.rowCount === 0) {
      res.status(401).send("Invalid token");
      return;
    }

    console.log(auth.rows);

    const created = new Date(auth.rows[0].created);

    if (Date.now() - created.getTime() > tokenDuration) {
      res.status(401).send("Token expired");

      query(`DELETE FROM tokens WHERE token = $1`, token);
      return;
    }

    (req as any).username = auth.rows[0].username;
  } catch(err) {
    console.log(err);

    res.status(401).send("Token error");
    return;
  }

  next();
}

export const createToken = (): string => {
  return randomBytes(64).toString('hex');
}

