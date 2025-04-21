// Import necessary modules and types
import { DBCatchable } from '../../library/Decorators/DBCatchable';
import { Nullish } from '../../library/Types';
import { RequestStatus } from '../../library/Validators/Request';
import { INewRequest, IRequest } from '../Models/Request';
import Request from '../Models/Request';

export class RequestCRUD {
  @DBCatchable('Error creating request')
  public static async createRequest(request: INewRequest): Promise<IRequest> {
    const newRequestData = {
      ...request,
      creationDate: new Date().getTime(),
      status: RequestStatus.PENDING
    };
    return await Request.create(newRequestData);
  }

  @DBCatchable('Error getting request by ID')
  public static async getRequestById(id: string): Promise<Nullish<IRequest>> {
    return await Request.findById(id).populate('users');
  }

  @DBCatchable('Error updating request')
  public static async updateRequest(
    id: string,
    updateData: Partial<IRequest>
  ): Promise<Nullish<IRequest>> {
    return await Request.findByIdAndUpdate(id, updateData, { new: true });
  }

  @DBCatchable('Error deleting request')
  public static async deleteRequest(id: string): Promise<void> {
    await Request.findByIdAndDelete(id);
  }

  @DBCatchable('Error getting all requests')
  public static async getAllRequests(): Promise<IRequest[]> {
    return await Request.find();
  }

  @DBCatchable('Error getting requests by user')
  public static async getRequestsByUser(userId: string): Promise<IRequest[]> {
    return await Request.find({ createdBy: userId });
  }

  @DBCatchable('Error getting requests for user')
  public static async getRequestsForUser(userId: string): Promise<IRequest[]> {
    return await Request.find({ createdFor: userId });
  }

  @DBCatchable('Error getting requests by status')
  public static async getRequestsByStatus(
    status: RequestStatus
  ): Promise<IRequest[]> {
    return await Request.find({ status });
  }

  @DBCatchable('Error accepting request')
  public static async acceptRequest(id: string): Promise<Nullish<IRequest>> {
    return await Request.findByIdAndUpdate(
      id,
      { status: RequestStatus.ACCEPTED, acceptanceDate: new Date() },
      { new: true }
    );
  }

  @DBCatchable('Error updating request status')
  public static async updateRequestStatus(
    id: string,
    status: RequestStatus
  ): Promise<Nullish<IRequest>> {
    const updateData: Partial<IRequest> = { status };
    if (status === RequestStatus.ACCEPTED) {
      updateData.acceptanceDate = new Date().getTime();
    }
    return await Request.findByIdAndUpdate(id, updateData, { new: true });
  }
}
