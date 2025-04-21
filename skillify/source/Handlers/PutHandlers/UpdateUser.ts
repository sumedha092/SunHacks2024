import { SkillCRUD } from '../../../database/Middleware/Skill';
import { UserCRUD } from '../../../database/Middleware/User';
import { IUpdateUser } from '../../../database/Models/User';
import { Catchable } from '../../../library/Decorators/Catchable';
import { Checkable } from '../../../library/Decorators/Checkable';
import { MissingBody, MissingHeaders } from '../../../library/Errors/Params';
import { InvalidUsername, UsernameExists } from '../../../library/Errors/User';
import {
  Handler,
  IHasChecks,
  ServerEvent
} from '../../../library/Interfaces/HandlerController';
import { UserValidator } from '../../../library/Validators/User';

@Checkable
export class UpdateUser extends Handler<ServerEvent> implements IHasChecks {
  constructor(event: ServerEvent) {
    super(event);
  }

  checkHeaders(): void {
    const requiredHeaders = ['username'];

    requiredHeaders.forEach((header) => {
      if (!this.event.req.headers[header]) {
        throw new MissingHeaders(`${header} not provided`, [header]);
      }
    });
  }

  checkAtleastOneOptionalHeader(): void {
    const optionalBodyKeys: (keyof IUpdateUser)[] = [
      'username',
      'name',
      'skills'
    ];

    const hasOneKey = optionalBodyKeys.some((key) => {
      const body = this.event.req.body as IUpdateUser;
      return body[key];
    });

    if (!hasOneKey) {
      throw new MissingBody(
        'Atleast one optional header must be provided',
        optionalBodyKeys
      );
    }
  }

  private async checkUsername(): Promise<void> {
    const username = (this.event.req.body as IUpdateUser).username;

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

  private checkSkills(): void {
    const skills = (this.event.req.body as IUpdateUser).skills;

    if (!Array.isArray(skills)) {
      throw new Error('Skills must be an array');
    }
  }

  @Catchable()
  runChecks(): Promise<void> {
    this.checkHeaders();
    this.checkAtleastOneOptionalHeader();

    if ((this.event.req.body as IUpdateUser).username) {
      return this.checkUsername();
    }

    if ((this.event.req.body as IUpdateUser).skills) {
      this.checkSkills();
    }

    return new Promise<void>((resolve) => {
      resolve();
    });
  }

  async parseSkills(): Promise<void> {
    const skills = (this.event.req.body as IUpdateUser).skills;

    if (skills) {
      (this.event.req.body as IUpdateUser).skills = (
        await SkillCRUD.getSkillsByName(skills)
      ).map((skill) => skill._id as string);
    }
  }

  @Catchable()
  async execute(): Promise<void> {
    const username = this.event.req.headers.username as string;
    const body = this.event.req.body as IUpdateUser;

    await this.parseSkills();

    const user = await UserCRUD.updateUser(username, body);

    this.event.res.status(200).send(user);
  }
}
