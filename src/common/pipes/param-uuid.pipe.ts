import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ParamUUIDPipe implements PipeTransform {
  transform(value: string) {
    if (!isUUID(value)) {
      throw new BadRequestException('Invalid UUID in route parameter');
    }
    return value;
  }
}