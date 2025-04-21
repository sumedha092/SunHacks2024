import { SkillCRUD } from '../../../database/Middleware/Skill';
import { Catchable } from '../../../library/Decorators/Catchable';
import {
  Handler,
  ServerEvent
} from '../../../library/Interfaces/HandlerController';

export class GetSkills extends Handler<ServerEvent> {
  constructor(event: ServerEvent) {
    super(event);
  }

  @Catchable()
  async execute(): Promise<void> {
    const allSkills = await SkillCRUD.getAllSkills();

    this.event.res.status(200).send(allSkills);
  }
}
