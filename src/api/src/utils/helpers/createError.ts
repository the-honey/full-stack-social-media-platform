import { StatusCodes } from 'http-status-codes';
import HttpException from '../exceptions/http.exception';

class createError {
  public static Unauthorised = (
    message: string = 'Unauthorised'
  ): HttpException => new HttpException(StatusCodes.UNAUTHORIZED, message);

  public static InternalServerError = (
    message: string = 'Internal Server Error'
  ): HttpException =>
    new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, message);

  public static BadRequest = (message: string = 'Bad Request'): HttpException =>
    new HttpException(StatusCodes.BAD_REQUEST, message);

  public static Created = (message: string = 'Created'): HttpException =>
    new HttpException(StatusCodes.CREATED, message);

  public static Forbidden = (message: string = 'Forbidden'): HttpException =>
    new HttpException(StatusCodes.FORBIDDEN, message);

  public static NotFound = (message: string = 'Not Found'): HttpException =>
    new HttpException(StatusCodes.NOT_FOUND, message);

  public static Conflict = (message: string = 'Conflict'): HttpException =>
    new HttpException(StatusCodes.CONFLICT, message);
}

export default createError;
