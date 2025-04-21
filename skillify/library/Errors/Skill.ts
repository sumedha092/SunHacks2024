import { HttpStatusCode } from 'axios';
import { BaseError, ErrorResponse } from '../Interfaces/Errors';

export class SkillExists extends BaseError {}
export class InvalidSkill extends BaseError {}

export class SkillExistsRes extends ErrorResponse {
  constructor() {
    super();
    this.code = HttpStatusCode.Conflict;
    this.title = 'Skill Already Exists';
    this.message = {
      error: 'Skill already exists'
    };
  }
}

export class InvalidSkillRes extends ErrorResponse {
  constructor() {
    super();
    this.code = HttpStatusCode.BadRequest;
    this.title = 'Invalid Skill';
    this.message = {
      error:
        'Invalid skill. Make sure it only contains letters and numbers, has min length of 2 non-space characters, and max length of 50 characters'
    };
  }
}
