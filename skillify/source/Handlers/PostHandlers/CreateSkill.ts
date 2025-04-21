import { SkillCRUD } from '../../../database/Middleware/Skill';
import { Catchable } from '../../../library/Decorators/Catchable';
import { Checkable } from '../../../library/Decorators/Checkable';
import { MissingHeaders } from '../../../library/Errors/Params';
import { InvalidSkill, SkillExists } from '../../../library/Errors/Skill';
import {
  Handler,
  IHasChecks,
  ServerEvent
} from '../../../library/Interfaces/HandlerController';
import { SkillValidator } from '../../../library/Validators/Skill';

@Checkable
export class CreateSkill extends Handler<ServerEvent> implements IHasChecks {
  constructor(event: ServerEvent) {
    super(event);
  }

  private async checkSkill(): Promise<void> {
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

    if (await SkillCRUD.skillExists(skill)) {
      throw new SkillExists('Skill already exists');
    }
  }

  @Catchable()
  async runChecks(): Promise<void> {
    await this.checkSkill();
  }

  @Catchable()
  async execute(): Promise<void> {
    await this.runChecks();

    const skill = this.event.req.headers.skill as string;

    const newSkill = await SkillCRUD.createSkill({ name: skill });

    this.event.res.status(201).send(newSkill);
  }
}
