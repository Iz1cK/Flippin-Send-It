import db from "../database/connection";

export const getUserById = (id: number) => {
  return db
    .query(`SELECT * FROM users WHERE id=$1`, [id])
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
  ];
  return db
    .query(
      `INSERT INTO users (username,password,email,firstname,lastname,age,gender) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
      userData
    )
    .then(({ rows }) => rows[0].id);
};
