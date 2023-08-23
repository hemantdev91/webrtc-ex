import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway(8081, { transports: ['websocket'], cors: { origin: '*' } })
export class TwGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  twilio;

  constructor(private configService: ConfigService) {
    this.twilio = this.configService.get('tw');
  }

  @SubscribeMessage('join')
  handleEvent(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    const clients = this.server.sockets.adapter.rooms[room];
    const numClients = typeof clients === 'undefined' ? 0 : clients.length;
    if (numClients === 0) {
      console.log('received joiners in room', room);
      client.join(room);
    } else if (numClients === 1) {
      client.join(room);
      client.emit('ready', room);
    } else {

      client.emit('full', room);
    }
  }

  @SubscribeMessage('abc')
  handleTest(@MessageBody() data: any) {
    console.log('event abc and data ', data);
  }

  @SubscribeMessage('token')
  async handleTwilioToken(@ConnectedSocket() client: Socket) {
    try {
      const response = await this.twilio.tokens.create();
      //console.log('response her is ', response);
      client.emit('token', response);
    } catch (e) {
      console.log('error while getting ice server', e);
    }
  }

  /**
  //broadcasting specs from iceserver to
  //to other browsers
   */
  @SubscribeMessage('candidate')
  handleBroadCastCandidate(
    @MessageBody() candidateOneSpecs: any,
    @ConnectedSocket() client: Socket,
  ) {
    client.broadcast.emit('candidate', candidateOneSpecs);
  }

  @SubscribeMessage('offer')
  handlePeerConnectionOffer(
    @MessageBody() offerData: any,
    @ConnectedSocket() client: Socket,
  ) {
    //const parsedData = JSON.parse(offerData);
    //console.log('offer data from client is ', parsedData);
    //this.server.to(parsedData.target).emit('offer', offerData);
    client.broadcast.emit('offer', offerData);
  }

  @SubscribeMessage('answer')
  handleAnswer(@MessageBody() answer, @ConnectedSocket() client: Socket) {
    //this.server.to(answer.target).emit('answer', answer);
    console.log('answer is', answer);
    client.broadcast.emit('answer', answer);
  }

  handleConnection(client: any, ...args: any[]): any {
    console.log('me connected');
  }
}
