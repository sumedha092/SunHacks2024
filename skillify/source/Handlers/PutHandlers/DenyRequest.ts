import { RequestCRUD } from '../../../database/Middleware/Request';
import { UserCRUD } from '../../../database/Middleware/User';
import { Catchable } from '../../../library/Decorators/Catchable';
import { Checkable } from '../../../library/Decorators/Checkable';
import { MissingHeaders } from '../../../library/Errors/Params';
import {
  Handler,
  IHasChecks,
  ServerEvent
} from '../../../library/Interfaces/HandlerController';
import { RequestStatus } from '../../../library/Validators/Request';
import { sendRequestDeniedEmail } from '../../Middleware/Email';

@Checkable
export class DenyRequest extends Handler<ServerEvent> implements IHasChecks {
  constructor(event: ServerEvent) {
    super(event);
  }

  checkHeaders(): void {
    if (!this.event.req.headers.request_id) {
      throw new MissingHeaders('Request ID not provided', ['request_id']);
    }
  }

  @Catchable()
  runChecks(): Promise<void> {
    this.checkHeaders();

    return new Promise<void>((resolve) => {
      resolve();
    });
  }

  @Catchable()
  async execute(): Promise<void> {
    const reqId = this.event.req.headers.request_id as string;

    const req = await RequestCRUD.updateRequestStatus(
      reqId,
      RequestStatus.DENIED
    );

    const receiver = await UserCRUD.getUserById(req!.createdFor.toString());

    this.event.res.status(200).send('Request denied');

    await sendRequestDeniedEmail(
      receiver!.name,
      receiver!.email,
      req!.title,
      req!.description,
      new Date().toDateString()
    );
  }
}
