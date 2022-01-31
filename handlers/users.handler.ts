import { getUserById } from "../models/users.model";

const getUser = async (req, res) => {
  const id = req.params.id;
  const data = await getUserById(id);
  res.status(201).send(data);
};

export default {
  getUser,
};
