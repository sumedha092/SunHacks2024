import { SkillCRUD } from '../../../database/Middleware/Skill';
import { Catchable } from '../../../library/Decorators/Catchable';
import { Checkable } from '../../../library/Decorators/Checkable';
import { MissingHeaders } from '../../../library/Errors/Params';
import { InvalidSkill } from '../../../library/Errors/Skill';
import {
  Handler,
  IHasChecks,
  ServerEvent
} from '../../../library/Interfaces/HandlerController';
import { SkillValidator } from '../../../library/Validators/Skill';

@Checkable
export class GetUsersBySkill
  extends Handler<ServerEvent>
  implements IHasChecks
{
  constructor(event: ServerEvent) {
    super(event);
  }

  private checkSkill(): void {
    const skill = this.event.req.headers.skill;

    if (!skill) {
      throw new MissingHeaders('Skill not provided', ['skill']);
    }

    if (typeof skill !== 'string') {
      throw new InvalidSkill('Skill must be a string');
    }

    if (!SkillValidator.Skill.safeParse(skill).success) {
      throw new InvalidSkill('Skill is invalid');
    }
  }

  @Catchable()
  async runChecks(): Promise<void> {
    this.checkSkill();

    await new Promise<void>((resolve) => {
      resolve();
    });
  }

  @Catchable()
  async execute(): Promise<void> {
    await this.runChecks();

    const skill = await SkillCRUD.getSkillsByName([
      this.event.req.headers.skill as string
    ]);

    const users = await SkillCRUD.getUsersBySkill(skill[0]._id.toString());

    this.event.res.status(201).send(users);
  }
}
