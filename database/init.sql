BEGIN;

DROP TABLE IF EXISTS users,friends,messages,requests,rooms,participants CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username varchar(36) UNIQUE,
    password varchar(256),
    email varchar(256) UNIQUE,
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
    friendship_date DATE DEFAULT CURRENT_TIMESTAMP,
    active boolean DEFAULT true
);

CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id),
    reciever_id INTEGER REFERENCES users(id),
    --status(accepted/pending/rejected)
    status varchar(16) DEFAULT 'pending',
    request_date DATE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name varchar(34)
);

CREATE TABLE participants(
    id SERIAL PRIMARY KEY,
    userid INTEGER REFERENCES users(id),
    roomid INTEGER REFERENCES rooms(id)
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    userid_1 INTEGER REFERENCES users(id),
    roomid INTEGER REFERENCES rooms(id),
    meessage_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message text
);

INSERT INTO users (username,password,email,firstname,lastname,age,gender) VALUES
('Kuala1','$2a$10$4d0ons8ELFLe4Blw67vVMujjLefWnmFfB7tjz.ZLOw9CC2ywS.aNa','durd20011@gmail.com','George','Jobran',20,'Male'),
('Mario','$2a$10$4d0ons8ELFLe4Blw67vVMujjLefWnmFfB7tjz.ZLOw9CC2ywS.aNa','durd20021@gmail.com','Mario','Saliba',20,'Male'),
('Nur','$2a$10$4d0ons8ELFLe4Blw67vVMujjLefWnmFfB7tjz.ZLOw9CC2ywS.aNa','durd20031@gmail.com','Nur','Awad',20,'Female'),
('Hala','$2a$10$4d0ons8ELFLe4Blw67vVMujjLefWnmFfB7tjz.ZLOw9CC2ywS.aNa','durd20041@gmail.com','Hala','Khamis',20,'Female'),
('Caster','$2a$10$4d0ons8ELFLe4Blw67vVMujjLefWnmFfB7tjz.ZLOw9CC2ywS.aNa','durd20051@hotmail.com','Caster','Jubran',22,'Male');

INSERT INTO friends (userid_1,userid_2) VALUES
(1,2),
(2,1),
(1,3),
(3,1),
(1,4),
(4,1);

INSERT INTO requests (sender_id,reciever_id) VALUES
(1,3),
(1,5),
(2,3),
(3,5);

INSERT INTO requests (sender_id,reciever_id,status) VALUES
(1,3,'rejected');

INSERT INTO rooms (name) VALUES 
('1'),
('2'),
('george');

INSERT INTO participants (userid,roomid) VALUES
(1,1),
(2,1),
(2,2),
(3,2);

INSERT INTO messages (userid_1,roomid,message) VALUES
(1,1,'Hello, my name is George, Its nice to meet you!'),
(2,1,'Hello there George, My name is Mario, Pleasured to meet you!');

COMMIT;