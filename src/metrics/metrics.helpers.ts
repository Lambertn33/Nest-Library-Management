import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class MetricsHelper {
  handleException(error: any, timer: () => void) {
    if (error instanceof HttpException) {
      timer();
      throw error;
    } else {
      timer();
      throw new HttpException('Internal Server Error', 500);
    }
  }
}
