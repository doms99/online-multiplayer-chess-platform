CREATE TABLE users
(
  username VARCHAR(25) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  score INT NOT NULL,
  email VARCHAR(100) NOT NULL,
  joined DATE NOT NULL,
  password VARCHAR(100) NOT NULL,
  PRIMARY KEY (username),
  UNIQUE (email)
);

CREATE TABLE tokens
(
  created TIMESTAMP NOT NULL,
  token VARCHAR(200) NOT NULL,
  username VARCHAR(25) NOT NULL,
  PRIMARY KEY (created, username),
  FOREIGN KEY (username) REFERENCES users(username)
);

CREATE TABLE status
(
  id serial NOT NULL,
  status VARCHAR(25) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE games
(
  id VARCHAR(64) NOT NULL,
  start TIMESTAMP NOT NULL,
  status int NOT NULL,
  duration INT NOT NULL,
  winner VARCHAR(25),
  PRIMARY KEY (id),
  FOREIGN KEY (winner) REFERENCES users(username),
  FOREIGN KEY (status) REFERENCES status(id)
);

CREATE TABLE moves
(
  move json NOT NULL,
  game_id VARCHAR(64) NOT NULL,
  time TIMESTAMP NOT NULL,
  PRIMARY KEY (game_id, time),
  FOREIGN KEY (game_id) REFERENCES games(id)
);

CREATE TABLE players
(
  color VARCHAR(5) NOT NULL,
  game_id VARCHAR(64) NOT NULL,
  username VARCHAR(25) NOT NULL,
  PRIMARY KEY (game_id, username),
  FOREIGN KEY (game_id) REFERENCES games(id),
  FOREIGN KEY (username) REFERENCES users(username)
);

insert into status(status) values('in progress');
insert into status(status) values('draw');
insert into status(status) values('win');