import {
  Controller,
  ServerEvent,
  HandlerController
} from '../../library/Interfaces/HandlerController';
import { ValidRoutes } from '../../server/ValidRoutes';
import { CreateRequest } from '../Handlers/PostHandlers/CreateRequest';
import { CreateSkill } from '../Handlers/PostHandlers/CreateSkill';
import { CreateUser } from '../Handlers/PostHandlers/CreateUser';

export class PostController extends Controller<ServerEvent> {
  private routeId: ValidRoutes;

  constructor(event: ServerEvent) {
    super(event);
    this.routeId = event.route;
  }

  protected resolve(): HandlerController<ServerEvent> | null {
    switch (this.routeId) {
      case ValidRoutes.CreateRequest:
        return new CreateRequest(this.trigger);
      case ValidRoutes.CreateSkill:
        return new CreateSkill(this.trigger);
      case ValidRoutes.CreateUser:
        return new CreateUser(this.trigger);
      default:
        return null;
    }
  }
}
