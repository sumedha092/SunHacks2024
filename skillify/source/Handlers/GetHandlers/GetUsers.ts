import { UserCRUD } from '../../../database/Middleware/User';
import { Catchable } from '../../../library/Decorators/Catchable';
import {
  Handler,
  ServerEvent
} from '../../../library/Interfaces/HandlerController';

export class GetUsers extends Handler<ServerEvent> {
  constructor(event: ServerEvent) {
    super(event);
  }

  @Catchable()
  async execute(): Promise<void> {
    const allUsers = await UserCRUD.getAllUsers(true);

    this.event.res.status(200).send(allUsers);
  }
}
