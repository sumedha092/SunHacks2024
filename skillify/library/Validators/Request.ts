import { z } from 'zod';

export enum RequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DENIED = 'denied'
}

export class RequestValidator {
  public static Status = z.nativeEnum(RequestStatus);
}
