import db from "../database/connection";

export const getAllPostsByUserId = (userId: number) => {
  return db
    .query(
      `SELECT * FROM posts WHERE userid=$1 ORDER BY post_date DESC LIMIT 50`,
      [userId]
    )
    .then(({ rows }) => rows);
};

export const makeNewPost = (post: {
  userid: number;
  post_title: string;
  post_content: string;
}) => {
  return db
    .query(
      `INSERT INTO posts (userid,post_title,post_content) 
     VALUES($1,$2,$3) 
     RETURNING postid`,
      [post.userid, post.post_title, post.post_content]
    )
    .then(({ rows }) => rows[0]);
};

export const updatePost = (postid: number) => {
  return db
    .query(
      `UPDATE posts SET post_title=$1,
                            post_content=$2,
                            likes=$3 
            WHERE postid=$4 RETURNING postid`,
      [postid]
    )
    .then(({ rows }) => rows);
};

export const hidePost = (postid: number) => {
  return db
    .query(`UPDATE posts SET hidden=true WHERE postid=$1 RETURNING postid`, [
      postid,
    ])
    .then(({ rows }) => rows);
};

export const showPost = (postid: number) => {
  return db
    .query(`UPDATE posts SET hidden=false WHERE postid=$1 RETURNING postid`, [
      postid,
    ])
    .then(({ rows }) => rows);
};
