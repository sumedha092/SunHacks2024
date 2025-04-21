import { HttpStatusCode } from 'axios';
import { BaseError, ErrorResponse } from '../Interfaces/Errors';

export class UserDoesNotExist extends BaseError {}
export class UserAlreadyExists extends BaseError {}
export class InvalidUsername extends BaseError {}
export class UsernameExists extends BaseError {}
export class EmailExists extends BaseError {}
export class InvalidEmail extends BaseError {}
export class InvalidName extends BaseError {}

export class UserDoesNotExistRes extends ErrorResponse {
  constructor() {
    super();
    this.code = HttpStatusCode.NotFound;
    this.title = 'User Does Not Exist';
    this.message = { error: 'User does not exist' };
  }
}

export class UserAlreadyExistsRes extends ErrorResponse {
  constructor() {
    super();
    this.code = HttpStatusCode.Conflict;
    this.title = 'User Already Exists';
    this.message = { error: 'User already exists' };
  }
}

export class InvalidUsernameRes extends ErrorResponse {
  constructor() {
    super();
    this.code = HttpStatusCode.BadRequest;
    this.title = 'Invalid Username';
    this.message = { error: 'Invalid username' };
  }
}

export class UsernameExistsRes extends ErrorResponse {
  constructor() {
    super();
    this.code = HttpStatusCode.Conflict;
    this.title = 'Username Exists';
    this.message = { error: 'Username already exists' };
  }
}

export class EmailExistsRes extends ErrorResponse {
  constructor() {
    super();
    this.code = HttpStatusCode.Conflict;
    this.title = 'Email Exists';
    this.message = { error: 'Email already exists' };
  }
}

export class InvalidEmailRes extends ErrorResponse {
  constructor() {
    super();
    this.code = HttpStatusCode.BadRequest;
    this.title = 'Invalid Email';
    this.message = { error: 'Invalid email' };
  }
}

export class InvalidNameRes extends ErrorResponse {
  constructor() {
    super();
    this.code = HttpStatusCode.BadRequest;
    this.title = 'Invalid Name';
    this.message = { error: 'Invalid name' };
  }
}
