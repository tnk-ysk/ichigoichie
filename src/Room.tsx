import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { appId, secret } from './env';
import WebRTC from './WebRTC';

const members = new Map<string, string>();
const client = new WebRTC(appId, secret);

// export const MembersContext = React.createContext(new Object());

export default function Room(props: {
  view: (props: {
    write: (data: any) => void;
    members: object;
  }) => JSX.Element
}) {
  const { roomName } = useParams();
  const [membersObj, setMembersObj] = useState(new Object());
  console.log("room");

  client.join(roomName!);
  client.onData((data: any) => {
    // TODO: member join
    members.set(data, data);
    setMembersObj(Object.fromEntries(members));
  });

  function write(data: any) {
    client.write(data);
  }

  return (
    <>
      <props.view write={write} members={membersObj} />
    </>
  )
}
