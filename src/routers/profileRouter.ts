import express from "express";
import { query } from "../db";
import { validatePassword, validateEmail } from "../util/validatorFunc";
const router = express.Router();

const tempData = {
  username: 'G_Kaspy123',
  firstName: 'Garry',
  lastName: 'Kasparov',
  email: 'garrykasparov@fer.hr',
  score: 2567
}

export default router.get("/", (req, res, next) => {
  const username = (req as any).username;

  query(`select games.id, games.status, games.winner, games.duration, games.start, players.white, players.black from games join (select game_id as id, p1.username as white, p2.username as black from  players as p1 inner join players as p2 using(game_id)
        where p1.color <> p2.color and p1.color = 'white') players using(id)
        where (white=$1 or black=$1) and games.status <> (select id from status where status='in progress')
        order by games.start desc`, username)
    .then(qRes => {
      res.status(200).json(qRes.rows);
    })
    .catch(err => {
      console.log(err);
      res.status(403).json({
        error: 'Error while retrieving data from datebase'
      });
    });
})