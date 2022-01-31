BEGIN;

DROP TABLE IF EXISTS users,friends,messages CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username varchar(36),
    password varchar(256),
    email varchar(256),
    firstname varchar(36),
    lastname varchar(36),
    verified boolean DEFAULT false,
    age INTEGER,
    gender varchar(12)
);

CREATE TABLE friends (
    id SERIAL PRIMARY KEY,
    userid_1 INTEGER REFERENCES users(id),
    userid_2 INTEGER REFERENCES users(id),
    --status(accepted/pending/rejected)
    status varchar(16) DEFAULT 'pending',
    friendship_date DATE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    userid_1 INTEGER REFERENCES users(id),
    userid_2 INTEGER REFERENCES users(id),
    meessage_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message text
);

INSERT INTO users (username,password,email,firstname,lastname,age,gender) VALUES
('Kuala','1234','durd2001@gmail.com','George','Jobran',20,'Male'),
('Caster','121212','durd2001@hotmail.com','Gugu','Jubran',22,'Female');

INSERT INTO friends (userid_1,userid_2) VALUES
(1,2);

INSERT INTO messages (userid_1,userid_2,message) VALUES
(1,2,'Hello, my name is George, Its nice to meet you');

COMMIT;