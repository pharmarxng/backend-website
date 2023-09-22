import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserSignUpDto } from './dtos/signup.dto';
import { IResponse } from 'src/common';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dtos/login.dto';
import * as bcrypt from 'bcryptjs';
import { TokenService } from './token.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private logger: Logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   *
   * @param body UserSignupDto
   * @returns Promise of a successful signup
   */
  async signUp(body: UserSignUpDto): Promise<IResponse<any>> {
    this.logger.debug('Executing Signup Method');
    const { email, confirmPassword, password } = body;
    console.log({ body });

    if (confirmPassword !== password)
      throw new ForbiddenException(
        'Password and confirmPassword fields must match',
      );

    console.log('It got here');
    //Check if user already exists in the database
    const foundUser = await this.userService.findUserbyEmail(email);

    console.log({ foundUser });
    if (foundUser)
      throw new ForbiddenException(
        `User already exists. Please login to continue`,
      );

    console.log('It got here 2');
    await this.userService.createUser({ ...body });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Sign up successful',
    };
  }

  /**
   * It takes in a phone number and password, checks if the user exists, if the user exists, it checks if
   * the password is valid, if the password is valid, it creates a new access token and refresh token and
   * returns them
   * @param {LoginDto} body - LoginDto
   * @returns A promise of a promise of a RequestResponse<LoginResponse>
   */
  async login(body: LoginDto) {
    const { email, password } = body;
    const userInDb = await this.userService.findUserbyEmail(email);
    if (!userInDb)
      throw new NotFoundException(`User with email: ${email} not found`);

    if (!bcrypt.compare(password, userInDb.password))
      throw new BadRequestException(`Invalid password`);

    const { accessToken, refreshToken } =
      await this.tokenService.handleCreateTokens(userInDb.id);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Sign up successful',
      data: {
        user: userInDb,
        accessToken,
        refreshToken,
      },
    };
  }

  /**
   * @description - Refreshes the expired token
   * @param token - The refresh token of the user
   * @returns - The new access token and refresh token
   */
  async refreshToken(token: string) {
    const { userId } = await this.jwtService.verify(token);
    if (!userId) throw new UnauthorizedException('Token Expired');
    const { accessToken, refreshToken } =
      await this.tokenService.handleCreateTokens(userId);
    return {
      status: HttpStatus.CREATED,
      message: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    };
  }
}
