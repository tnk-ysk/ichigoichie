import {
  nowInSec,
  SkyWayAuthToken,
  SkyWayContext,
  SkyWayRoom,
  P2PRoom,
  LocalP2PRoomMember,
  SkyWayStreamFactory,
  uuidV4,
  LocalDataStream,
} from '@skyway-sdk/room';

export default class WebRTC {
  roomName: string | null = null;
  private _token: string;
  // private context: SkyWayContext;
  private _room!: P2PRoom;
  private _member!: LocalP2PRoomMember;
  private _dataStream!: LocalDataStream;
  private onDataEvents: Array<CallableFunction> = [];

  constructor(
    appId: string,
    secret: string,
  ) {
    this._token = new SkyWayAuthToken({
      jti: uuidV4(),
      iat: nowInSec(),
      exp: nowInSec() + 60 * 60 * 24,
      scope: {
        app: {
          id: appId,
          turn: true,
          actions: ['read'],
          channels: [
            {
              id: '*',
              name: '*',
              actions: ['write'],
              members: [
                {
                  id: '*',
                  name: '*',
                  actions: ['write'],
                  publication: {
                    actions: ['write'],
                  },
                  subscription: {
                    actions: ['write'],
                  },
                },
              ],
              sfuBots: [
                {
                  actions: ['write'],
                  forwardings: [
                    {
                      actions: ['write'],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    }).encode(secret);
  }

  // get room(): P2PRoom {
  //   return this._room;
  // }
  // get member(): LocalP2PRoomMember {
  //   return this._member;
  // }
  // get dataStream(): LocalDataStream {
  //   return this._dataStream;
  // }
  private async connect(roomName: string) {
    this._dataStream = await SkyWayStreamFactory.createDataStream();
    const context = await SkyWayContext.Create(this._token, {
      // log: { level: 'warn', format: 'object' },
    });
    console.log("b")
    this._room = await SkyWayRoom.FindOrCreate(context, {
      type: 'p2p',
      name: roomName,
    });
    this._member = await this._room.join()
    console.log("a")

    const subscribe = async (publication: any) => {
      if (publication.publisher.id === this._member.id) return;
      await this._member.subscribe(publication.id);
    };
    this._room.publications.forEach(subscribe);
    this._room.onStreamPublished.add((e) => subscribe(e.publication));

    // this._room.onMemberLeft.add((e) => {
    //   this._member.unsubscribe(e.member.id);
    // });

    console.log("publish stream")
    await this._member.publish(this._dataStream);

    this._member.onPublicationSubscribed.add(async ({ stream, subscription }) => {
      if (stream.contentType !== 'data') return;
      console.log(`onPublicationSubscribed: ${subscription.publication.publisher.id}`);
      stream.onData.add((data) => {
        console.log(`data: ${data}`);
        for (const func of this.onDataEvents) {
          func(data);
        }
      });
    });

    this._room.onMemberLeft.add()
  }

  join(roomName: string) {
    if (this.roomName != null) return;
    this.roomName = roomName;
    this.connect(roomName);
  }

  onData(func: CallableFunction) {
    this.onDataEvents.push(func);
  }

  write(data: any) {
    this._dataStream.write(data);
  }
}
