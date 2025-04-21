import { ISkill } from "./ISkill";

export interface IUser {
  _id: string;
  username: string;
  name: string;
  email: string;
  createdAt: number;
  skills?: ISkill[];
}

export type INewUser = {
  username: string;
  name: string;
  email: string;
};
