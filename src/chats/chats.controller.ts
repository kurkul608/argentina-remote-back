import { Controller, Get, Param, Post, Query, UsePipes } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateChatDto } from './create-chat.dto';
import { PaymentType } from '../payment/dto/create-payment.dto';
import { MongoIdPipe } from '../pipes/mongo-id.pipe';
import { GetChatsQueryDto } from 'src/chats/dto/query/get-chats-query.dto';

@Controller('chats')
@ApiTags('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @ApiOperation({ summary: 'Return full chats list' })
  @ApiResponse({ status: 200, type: [CreateChatDto] })
  @ApiQuery({
    example: 10,
    name: 'limit',
    required: true,
  })
  @ApiQuery({
    example: 0,
    name: 'offset',
    required: true,
  })
  @Get()
  getAll(@Query() query: GetChatsQueryDto) {
    const { limit, q, isHidden, offset } = query;
    return this.chatsService.getAll(limit, offset, isHidden, q);
  }
  @ApiOperation({ summary: 'Return chat information' })
  @ApiResponse({ status: 200, type: Object })
  @ApiQuery({
    example: PaymentType.donation,
    name: 'paymentType',
    required: false,
    enum: PaymentType,
  })
  @UsePipes(MongoIdPipe)
  @Get(':id')
  getChatInfo(
    @Param('id') id: string,
    @Query('paymentType') paymentType: PaymentType,
  ) {
    return this.chatsService.getChatInfo(id, paymentType);
  }

  @ApiOperation({ summary: 'Change chat visible' })
  @ApiResponse({ status: 200, type: [CreateChatDto] })
  @ApiQuery({
    example: true,
    name: 'isHidden',
    required: false,
  })
  @UsePipes(MongoIdPipe)
  @Post(':id/change-visible')
  changeChatVisible(
    @Param('id') id: string,
    @Query('isHidden') isHidden: boolean,
  ) {
    return this.chatsService.changeVisible(id, isHidden);
  }
}
