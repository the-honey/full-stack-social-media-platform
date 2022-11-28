import { HTTPCodes } from './response';
import HttpException from '../exceptions/http.exception';

class createError {
  public static Unauthorised = (
    message: string = 'Unauthorised'
  ): HttpException => new HttpException(HTTPCodes.NOT_AUTHORIZED, message);

  public static InternalServerError = (
    message: string = 'Internal Server Error'
  ): HttpException => new HttpException(HTTPCodes.SERVER_ERROR, message);

  public static BadRequest = (message: string = 'Bad Request'): HttpException =>
    new HttpException(HTTPCodes.BAD_REQUEST, message);

  public static Created = (message: string = 'Created'): HttpException =>
    new HttpException(HTTPCodes.CREATED, message);

  public static Forbidden = (message: string = 'Forbidden'): HttpException =>
    new HttpException(HTTPCodes.FORBIDDEN, message);

  public static NotFound = (message: string = 'Not Found'): HttpException =>
    new HttpException(HTTPCodes.NOT_FOUND, message);

  public static Conflict = (message: string = 'Conflict'): HttpException =>
    new HttpException(HTTPCodes.CONFLICT, message);
}

export default createError;
