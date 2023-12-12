import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EmitMessageDto } from './dto/EmitMessageDto';
@Injectable()
export class RabbitMQService {
  constructor(@Inject('rmq-summarizer') private readonly client: ClientProxy) {}

  public emit({ pattern, data }: EmitMessageDto) {
    return this.client.emit(pattern, data);
  }
}
