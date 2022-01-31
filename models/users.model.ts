import db from "../database/connection";

export const getUserById = (id: number) => {
  return db
    .query(`SELECT * FROM users WHERE id=$1`, [id])
    .then(({ rows }) => rows);
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

export const sendFriendRequest = (senderId: number, recieverId: number) => {
  return db
    .query(
      `INSERT INTO friends (userid_1,userid_2) VALUES($1,$2) RETUNING id`,
      [senderId, recieverId]
    )
    .then(({ rows }) => rows[0].id);
};

export const updateFriendRequest = (requestId: number, status: string) => {
  return db
    .query(`UPDATE friends SET status=$1 WHERE id=$2`, [status, requestId])
    .then(() => {
      return { id: requestId, status: "success" };
    });
};

export const acceptFriendRequest = (requestId: number) => {
  return db
    .query(`UPDATE friends SET status='accepted' WHERE id=$1`, [requestId])
    .then(() => {
      return { id: requestId, status: "success" };
    });
};

export const denyFriendRequest = (requestId: number) => {
  return db
    .query(`UPDATE friends SET status='denied' WHERE id=$1`, [requestId])
    .then(() => {
      return { id: requestId, status: "success" };
    });
};
