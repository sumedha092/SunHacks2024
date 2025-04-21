import { RequestCRUD } from '../../../database/Middleware/Request';
import { UserCRUD } from '../../../database/Middleware/User';
import { IUser } from '../../../database/Models/User';
import { Catchable } from '../../../library/Decorators/Catchable';
import { Checkable } from '../../../library/Decorators/Checkable';
import { MissingHeaders } from '../../../library/Errors/Params';
import { UserDoesNotExist } from '../../../library/Errors/User';
import {
  Handler,
  IHasChecks,
  ServerEvent
} from '../../../library/Interfaces/HandlerController';

@Checkable
export class GetSentRequests
  extends Handler<ServerEvent>
  implements IHasChecks
{
  constructor(event: ServerEvent) {
    super(event);
  }

  private async userExists(): Promise<void> {
    const exists = await UserCRUD.userExists(
      this.event.req.headers.username as string
    );

    if (!exists) {
      throw new UserDoesNotExist('User does not exist');
    }
  }

  private checkUsername(): void {
    if (
      !this.event.req.headers.username &&
      typeof this.event.req.headers.username !== 'string'
    ) {
      throw new MissingHeaders('Username not provided', ['username']);
    }
  }

  @Catchable()
  async runChecks(): Promise<void> {
    this.checkUsername();
    await this.userExists();
  }

  @Catchable()
  async execute(): Promise<void> {
    const user = (await UserCRUD.getUserByUsername(
      this.event.req.headers.username as string
    )) as IUser;

    const userId = user._id;

    const allSentRequests = await RequestCRUD.getRequestsByUser(
      userId.toString()
    );

    this.event.res.status(200).send(allSentRequests);
  }
}
