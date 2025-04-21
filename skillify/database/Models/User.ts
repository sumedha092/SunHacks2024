import mongoose, { Types } from 'mongoose';
import { ISkill } from './Skills';

export interface IUser {
  _id: Types.ObjectId | string;
  username: string;
  name: string;
  email: string;
  createdAt: number;
  skills?: ISkill[];
}

export type INewUser = Pick<IUser, 'username' | 'name' | 'email'>;
export type IUpdateUser = Partial<
  Pick<IUser, 'name' | 'username'> & { skills: string[] }
>;

const UserSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9_]{3,30}$/
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  createdAt: {
    type: Number,
    required: true
  },
  skills: [
    {
      type: Types.ObjectId,
      ref: 'skills',
      default: []
    }
  ]
});

const User = mongoose.model<IUser>('users', UserSchema);
export default User;
