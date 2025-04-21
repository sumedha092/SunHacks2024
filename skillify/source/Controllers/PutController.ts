import {
  Controller,
  ServerEvent,
  HandlerController
} from '../../library/Interfaces/HandlerController';
import { ValidRoutes } from '../../server/ValidRoutes';
import { AcceptRequest } from '../Handlers/PutHandlers/AcceptRequest';
import { DenyRequest } from '../Handlers/PutHandlers/DenyRequest';
import { UpdateUser } from '../Handlers/PutHandlers/UpdateUser';

export class PutController extends Controller<ServerEvent> {
  private routeId: ValidRoutes;

  constructor(event: ServerEvent) {
    super(event);
    this.routeId = event.route;
  }

  protected resolve(): HandlerController<ServerEvent> | null {
    switch (this.routeId) {
      case ValidRoutes.UpdateUser:
        return new UpdateUser(this.trigger);
      case ValidRoutes.AcceptRequest:
        return new AcceptRequest(this.trigger);
      case ValidRoutes.DenyRequest:
        return new DenyRequest(this.trigger);
      default:
        return null;
    }
  }
}
