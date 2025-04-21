import {
  DBConnectionFailure,
  DBConnectionFailureRes,
  DBError,
  DBErrorRes
} from '../Errors/Database';
import { CouldNotSendEmail, CouldNotSendEmailRes } from '../Errors/Email';
import {
  MissingBody,
  MissingBodyRes,
  MissingHeaders,
  MissingParamsRes
} from '../Errors/Params';
import {
  InvalidSkill,
  InvalidSkillRes,
  SkillExists,
  SkillExistsRes
} from '../Errors/Skill';
import {
  EmailExists,
  EmailExistsRes,
  InvalidEmail,
  InvalidEmailRes,
  InvalidName,
  InvalidNameRes,
  InvalidUsername,
  InvalidUsernameRes,
  UserAlreadyExists,
  UserAlreadyExistsRes,
  UserDoesNotExist,
  UserDoesNotExistRes,
  UsernameExists,
  UsernameExistsRes
} from '../Errors/User';
import { ErrorResponse } from '../Interfaces/Errors';
import { LoggerUtils } from './LoggerUtils';

export type CustomErrorType = new (...args: any[]) => Error;

class GenericErrorResponse extends ErrorResponse {
  constructor() {
    super();

    this.code = 500;
    this.title = 'Internal Server Error';
    this.message = {
      error: 'An error occurred while processing the request'
    };
  }
}

export class ErrorUtils {
  private static errorResMap = new Map<string, (error: any) => ErrorResponse>([
    [DBConnectionFailure.name, () => new DBConnectionFailureRes()],
    [DBError.name, () => new DBErrorRes()],
    [CouldNotSendEmail.name, () => new CouldNotSendEmailRes()],
    [
      MissingHeaders.name,
      (error: MissingHeaders) => new MissingParamsRes(error.missingHeaders)
    ],
    [
      MissingBody.name,
      (error: MissingBody) => new MissingBodyRes(error.missingBody)
    ],
    [UserDoesNotExist.name, () => new UserDoesNotExistRes()],
    [UserAlreadyExists.name, () => new UserAlreadyExistsRes()],
    [InvalidUsername.name, () => new InvalidUsernameRes()],
    [UsernameExists.name, () => new UsernameExistsRes()],
    [EmailExists.name, () => new EmailExistsRes()],
    [InvalidEmail.name, () => new InvalidEmailRes()],
    [InvalidName.name, () => new InvalidNameRes()],
    [SkillExists.name, () => new SkillExistsRes()],
    [InvalidSkill.name, () => new InvalidSkillRes()]
  ]);

  public static getErrorRes(
    error: unknown,
    showError?: boolean
  ): ErrorResponse {
    LoggerUtils.error(
      `${(error as Error).name} ` + `${(error as Error).message}`
    );

    if (showError) {
      LoggerUtils.error(error);
    }

    const errorName = error instanceof Error ? error.name : '';
    const errorRes =
      this.errorResMap.get(errorName)?.(error) ?? new GenericErrorResponse();

    return errorRes;
  }

  public static throwCustomError<T extends CustomErrorType>(
    error: unknown,
    message: string,
    CustomError: T
  ): never {
    LoggerUtils.error(error);

    if (error instanceof Error) {
      throw new CustomError(`${message}: ${error.message}`);
    } else {
      throw new CustomError(message);
    }
  }
}
