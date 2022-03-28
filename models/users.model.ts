import db from "../database/connection";

export const verifyUserById = (id: number) => {
  return db
    .query(`UPDATE users SET verified=true WHERE userid=$1 RETURNING email`, [
      id,
    ])
    .then(({ rows }) => rows[0]);
};

export const getUserById = (id: number) => {
  return db
    .query(`SELECT * FROM users WHERE userid=$1`, [id])
    .then(({ rows }) => rows[0]);
};

export const getUserByUsername = (username: string) => {
  return db
    .query(`SELECT * FROM users WHERE username=$1`, [username])
    .then(({ rows }) => rows[0]);
};

export const getUserByEmail = (email: string) => {
  return db
    .query(`SELECT * FROM users WHERE email=$1`, [email])
    .then(({ rows }) => rows[0]);
};

export const addUser = (user: any) => {
  const userData = [
    user.username,
    user.password,
    user.email,
    user.firstname,
    user.lastname,
    user.age,
    user.gender,
    user.imageid,
  ];
  return db
    .query(
      `INSERT INTO users (username,password,email,firstname,lastname,age,gender,imageid) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING userid`,
      userData
    )
    .then(({ rows }) => rows[0].userid);
};
