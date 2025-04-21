// src/models/request.ts

export interface Request {
  id: number;
  createdBy: string | null;
  acceptedBy: string | null;
  title: string;
  description: string;
  requestType: string;
  status: string;
}

export type INewRequest = {
  description: string;
  title: string;
  createdBy: string;
  createdFor: string;
};

export interface IRequest {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdBy: string;
  createdFor: string;
  creationDate: number;
  acceptanceDate: number;
}
