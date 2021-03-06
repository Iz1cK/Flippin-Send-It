import db from "../database/connection";

export const addMessageToRoom = (
  userId: number,
  roomId: number,
  message: string
) => {
  return db
    .query(
      `INSERT INTO messages (userid,roomid,message) VALUES ($1,$2,$3) RETURNING messageid`,
      [userId, roomId, message]
    )
    .then(({ rows }) => rows[0].id);
};

export const addUserToRoom = (userId: number, roomId: number) => {
  return db
    .query(
      `INSERT INTO participants (userid,roomid) VALUES ($1,$2) RETURNING participantid`,
      [userId, roomId]
    )
    .then(({ rows }) => rows[0].id);
};

export const isUserAParticipantOfRoom = (userId: number, roomId: number) => {
  return db
    .query(`SELECT * FROM participants WHERE userid=$1 AND roomid=$2`, [
      userId,
      roomId,
    ])
    .then(({ rows }) => !!rows[0]);
};

export const getAllMessagesFromRoom = (roomId: number) => {
  return db
    .query(`SELECT * FROM messages WHERE roomid=$1`, [roomId])
    .then(({ rows }) => rows);
};

//get room for particpant if there is
export const getRoomByParticipant = (userId: number, otherId: number) => {
  return db
    .query(`SELECT roomid FROM participants WHERE userid=$1 OR userid=$2`, [
      userId,
      otherId,
    ])
    .then(({ rows }) => {
      const mappedRoomIds = rows.map((room) => room.roomid);
      const duplicateRoomIds = mappedRoomIds.filter(
        (item, index) => mappedRoomIds.indexOf(item) !== index
      );
      return duplicateRoomIds[0];
    });
};

export const getRoomParticipants = (roomid: number) => {
  return db
    .query(
      `SELECT * FROM participants INNER JOIN users ON participants.userid = users.userid WHERE roomid=$1`,
      [roomid]
    )
    .then(({ rows }) => rows);
};

export const addNewRoom = (name: string) => {
  return db
    .query(`INSERT INTO rooms (name) VALUES ($1) RETURNING roomid`, [name])
    .then(({ rows }) => rows[0].id);
};

export const isRoomExists = (roomid: number) => {
  return db
    .query(`SELECT * FROM rooms WHERE roomid=$1`, [roomid])
    .then(({ rows }) => !!rows[0]);
};

export const getRoomNameById = (roomid: number) => {
  return db
    .query(`SELECT name FROM rooms WHERE roomid = $1`, [roomid])
    .then(({ rows }) => rows[0]);
};
