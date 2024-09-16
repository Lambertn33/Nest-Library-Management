import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { MetricsService } from 'src/metrics/metrics.service';
import { MetricsHelper } from 'src/metrics/metrics.helpers';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private databaseService: DatabaseService,
    private metricsService: MetricsService,
    private metricsHelper: MetricsHelper,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.databaseService.user.findFirst({
      where: {
        email,
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async checkUserExistence(email: string) {
    const user = await this.databaseService.user.findFirst({
      where: { email },
    });

    return !!user;
  }

  async login(id: number, names: string, email: string, role: string) {
    const timer = this.metricsService.startDbTimer('POST', '/auth/login', 200);
    try {
      const payload = {
        sub: id,
        email,
        names,
        role,
      };
      timer();
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      this.metricsHelper.handleException(error, timer);
    }
  }

  async register(names: string, email: string, pass: string) {
    const timer = this.metricsService.startDbTimer(
      'POST',
      '/auth/register',
      201,
    );
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(pass, salt);

    try {
      const newUser = await this.databaseService.user.create({
        data: {
          email,
          names,
          password: hashedPassword,
        },
      });

      const { access_token } = await this.login(
        newUser.id,
        newUser.names,
        newUser.email,
        newUser.role,
      );

      return {
        message: 'user created successfuly',
        user: {
          id: newUser.id,
          names: newUser.names,
          email: newUser.email,
          role: newUser.role,
        },
        access_token,
      };
    } catch (error) {
      this.metricsHelper.handleException(error, timer);
    }
  }
}
