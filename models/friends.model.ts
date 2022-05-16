import db from "../database/connection";

export const getOutgoingPendingRequests = (userId: number) => {
  return db
    .query(`SELECT * FROM requests WHERE sender_id=$1 AND status='pending'`, [
      userId,
    ])
    .then(({ rows }) => rows);
};

export const getIncomingPendingRequests = (userId: number) => {
  return db
    .query(`SELECT * FROM requests WHERE reciever_id=$1 AND status='pending'`, [
      userId,
    ])
    .then(({ rows }) => rows);
};

export const checkIfRequestExists = (
  //maybe add active to prevent spam of friend requests
  userId: number,
  otherId: number
) => {
  return db
    .query(
      `SELECT * FROM requests WHERE reciever_id = $1 AND sender_id = $2 AND status='pending' OR reciever_id = $2 AND sender_id = $1 AND status='pending'`,
      [userId, otherId]
    )
    .then(({ rows }) => rows[0]);
};

export const getAllFriends = (userId: number) => {
  return db
    .query(
      `SELECT * FROM users INNER JOIN friends ON friends.userid_2 = users.userid WHERE friends.userid_1 = $1`,
      [userId]
    )
    .then(({ rows }) => rows);
};

export const createFriendRequest = (senderId: number, recieverId: number) => {
  return db
    .query(
      `INSERT INTO requests (sender_id,reciever_id) VALUES($1,$2) RETURNING friendid`,
      [senderId, recieverId]
    )
    .then(({ rows }) => rows[0].id);
};

export const acceptFriendRequest = (requestId: number) => {
  return db
    .query(
      `UPDATE requests SET status='accepted' WHERE requestid=$1 RETURNING sender_id,reciever_id`,
      [requestId]
    )
    .then(({ rows }) => {
      return db
        .query(
          `INSERT INTO friends (userid_1,userid_2) VALUES($1,$2),($2,$1) RETURNING friendid`,
          [rows[0].sender_id, rows[0].reciever_id]
        )
        .then(({ rows }) => rows);
    });
};

export const rejectFriendRequest = (requestId: number) => {
  return db
    .query(`UPDATE requests SET status='rejected' WHERE requestid=$1`, [
      requestId,
    ])
    .then(() => {
      return { id: requestId, status: "success" };
    });
};

export const deleteFriend = (userId: number, friendId: number) => {
  return db
    .query(
      `UPDATE friends SET active=false WHERE userid_1=$1 AND userid_2=$2 OR userid_1=$2 AND userid_2=$1 RETURNING friendid`,
      [userId, friendId]
    )
    .then(({ rows }) => rows[0].id);
};

export const getFriendByOtherId = (userId: number, otherId: number) => {
  return db
    .query(`SELECT * FROM friends WHERE userid_1=$1 AND userid_2=$2`, [
      userId,
      otherId,
    ])
    .then(({ rows }) => rows[0]);
};

export const checkIfOtherIsFriend = (userId: number, otherId: number) => {
  return db
    .query(`SELECT * FROM friends WHERE userid_1=$1 AND userid_2=$2`, [
      userId,
      otherId,
    ])
    .then(({ rows }) => !!rows[0]);
};

export const getFriendRequestStatus = (requestId: number) => {
  return db
    .query(`SELECT status FROM requests WHERE requestid=$1`, [requestId])
    .then(({ rows }) => rows[0].status);
};

export const isFriendRequestExists = (senderId: number, recieverId: number) => {
  return db
    .query(
      `SELECT * FROM requests WHERE sender_id=$1 AND reciever_id=$2 OR reciever_id=$1 AND sender_id=$2`,
      [senderId, recieverId]
    )
    .then(({ rows }) => !!rows[0]);
};
