import { NextFunction, Request, Response } from "express";
import { User, UserStore } from "./user.store.js";
import { SearchQuery } from "../../../contracts/search.query.js";

export const getList = (search: string): [User[], number] => {
  const users = UserStore.find(search);
  return [users, users.length];
};
