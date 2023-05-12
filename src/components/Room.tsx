import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { appId, secret } from '../env';
import WebRTC from '../api/WebRTC';

export type Member = {
  userId: string,
  userName: number,
  attributes: Array<string>,
  state: string,
};
type Data = {
  type: string,
  body: any,
}

const members = new Map<string, Member>();
const offers = new Map<string, number>();
const client = new WebRTC(appId, secret);

export default function Room(props: {
  view: (props: {
    write: (data: any) => void;
    members: Map<string, Member>;
  }) => JSX.Element
}) {
  const { roomName } = useParams();
  const [membersMap, setMembersMap] = useState(new Map<string, Member>());

  client.join(roomName!);
  client.onData((data: Data) => {
    // TODO: member join
    switch (data.type) {
      case 'update':
        if (members.get(data.body.userId) === data.body) return;
        console.log("set member")
        members.set(data.body.userId, data.body);
        setMembersMap({ ...members });
        break;
      default:
        console.error(`Unknown data type: ${data.type}`);

    }
  });

  function write(data: any) {
    client.write(data);
  }

  return (
    <>
      <props.view write={write} members={membersMap} />
    </>
  )
}
