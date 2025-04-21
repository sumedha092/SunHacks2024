import mongoose, { Types } from 'mongoose';
import { RequestStatus } from '../../library/Validators/Request';

export interface IRequest {
  _id: Types.ObjectId | string;
  title: string;
  description: string;
  status: string;
  createdBy: Types.ObjectId | string;
  createdFor: Types.ObjectId | string;
  creationDate: number;
  acceptanceDate: number;
}

export type INewRequest = Pick<
  IRequest,
  'title' | 'description' | 'createdBy' | 'createdFor'
>;

const RequestSchema = new mongoose.Schema<IRequest>({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(RequestStatus),
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  createdFor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  creationDate: {
    type: Number,
    required: true
  },
  acceptanceDate: {
    type: Number,
    required: false
  }
});

const Request = mongoose.model<IRequest>('requests', RequestSchema);
export default Request;
