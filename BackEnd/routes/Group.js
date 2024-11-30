import express from "express";
import {
  CreatGroup,
  getGroups,
  addUserToGroup,
  getGroupWithId,
  getUsersNotInGroup,
} from "../controllers/Group.js";
const router = express.Router();

router.post("/create", CreatGroup);

router.put("/addUser", addUserToGroup);
router.get("/", getGroups);
router.get("/usereNotInGroup/:groupId", getUsersNotInGroup);
router.get("/group/:id", getGroupWithId);


export default router;
