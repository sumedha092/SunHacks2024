import { UserCRUD } from '../../../database/Middleware/User';
import { Catchable } from '../../../library/Decorators/Catchable';
import { Checkable } from '../../../library/Decorators/Checkable';
import { MissingHeaders } from '../../../library/Errors/Params';
import {
  EmailExists,
  InvalidEmail,
  InvalidName,
  InvalidUsername,
  UsernameExists
} from '../../../library/Errors/User';
import {
  Handler,
  IHasChecks,
  ServerEvent
} from '../../../library/Interfaces/HandlerController';
import { UserValidator } from '../../../library/Validators/User';

@Checkable
export class CreateUser extends Handler<ServerEvent> implements IHasChecks {
  constructor(event: ServerEvent) {
    super(event);
  }

  private async checkUsername(): Promise<void> {
    const username = this.event.req.headers.username;

    if (!username) {
      throw new MissingHeaders('Username not provided', ['username']);
    }

    if (typeof username !== 'string') {
      throw new InvalidUsername('Username must be a string');
    }

    if (!UserValidator.Username.safeParse(username).success) {
      throw new InvalidUsername('Username is invalid');
    }

    if (await UserCRUD.userExists(username)) {
      throw new UsernameExists('Username already exists');
    }
  }

  private async checkEmail(): Promise<void> {
    const email = this.event.req.headers.email;

    if (!email) {
      throw new MissingHeaders('Email not provided', ['email']);
    }

    if (typeof email !== 'string') {
      throw new InvalidEmail('Email must be a string');
    }

    if (!UserValidator.Email.safeParse(email).success) {
      throw new InvalidEmail('Email is invalid');
    }

    if (await UserCRUD.emailExists(email)) {
      throw new EmailExists('Username already exists');
    }
  }

  private checkName(): void {
    const name = this.event.req.headers.name;

    if (!name) {
      throw new MissingHeaders('Name not provided', ['name']);
    }

    if (typeof name !== 'string') {
      throw new InvalidName('Name must be a string');
    }

    if (!UserValidator.Name.safeParse(name).success) {
      throw new InvalidName('Name is invalid');
    }
  }

  @Catchable()
  async runChecks(): Promise<void> {
    await this.checkUsername();
    await this.checkEmail();
    this.checkName();
  }

  @Catchable()
  async execute(): Promise<void> {
    const username = this.event.req.headers.username as string;
    const name = this.event.req.headers.name as string;
    const email = this.event.req.headers.email as string;

    const user = await UserCRUD.createUser({ username, name, email });

    this.event.res.status(200).send(user);
  }
}
