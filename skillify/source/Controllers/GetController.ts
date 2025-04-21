import {
  Controller,
  HandlerController,
  ServerEvent
} from '../../library/Interfaces/HandlerController';
import { ValidRoutes } from '../../server/ValidRoutes';
import { GetReceivedRequests } from '../Handlers/GetHandlers/GetRecievedRequests';
import { GetSentRequests } from '../Handlers/GetHandlers/GetSentRequests';
import { GetSkills } from '../Handlers/GetHandlers/GetSkills';
import { GetUser } from '../Handlers/GetHandlers/GetUser';
import { GetUsers } from '../Handlers/GetHandlers/GetUsers';
import { GetUsersBySkill } from '../Handlers/GetHandlers/GetUsersBySkill';

export class GetController extends Controller<ServerEvent> {
  private routeId: ValidRoutes;

  constructor(event: ServerEvent) {
    super(event);
    this.routeId = event.route;
  }

  protected resolve(): HandlerController<ServerEvent> | null {
    switch (this.routeId) {
      case ValidRoutes.GetSentRequests:
        return new GetSentRequests(this.trigger);
      case ValidRoutes.GetReceivedRequests:
        return new GetReceivedRequests(this.trigger);
      case ValidRoutes.GetSkills:
        return new GetSkills(this.trigger);
      case ValidRoutes.GetUsers:
        return new GetUsers(this.trigger);
      case ValidRoutes.GetUser:
        return new GetUser(this.trigger);
      case ValidRoutes.GetUsersBySkill:
        return new GetUsersBySkill(this.trigger);
      default:
        return null;
    }
  }
}
