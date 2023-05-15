import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { appId, secret } from '../env';
import WebRTC from '../api/WebRTC';

export type Member = {
  userId: string,
  publisherId: string,
  userName: string,
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
    members: Array<Member>;
  }) => JSX.Element
}) {
  const { roomName } = useParams();
  const [membersList, setMembersList] = useState([...members.values()]);

  useEffect(() => { console.log(membersList.length) }, [membersList])

  client.join(roomName!);
  // const setting = JSON.parse(localStorage.getItem(roomName!) ?? '{}');
  client.onData((publisherId: string, data: Data) => {
    // TODO: member join
    switch (data.type) {
      case 'update':
        if (JSON.stringify(data.body) === JSON.stringify(members.get(data.body.userId))) return;
        const oldMembers: string[] = [];
        members.forEach((item, key) => {
          if (item.userId === data.body.userId) {
            oldMembers.push(key);
          }
        });
        oldMembers.forEach((item) => {
          members.delete(item);
        });

        console.log(`update member: ${publisherId}`)
        data.body.publisherId = publisherId;
        members.set(data.body.userId, data.body);
        console.log("AAA" + JSON.stringify({ ...members }))
        console.log("BBB" + JSON.stringify(members))
        console.log("CCC" + JSON.stringify(data.body))
        console.log("DDD" + JSON.stringify([...members.values()]))
        console.log("EEE" + JSON.stringify(members.get(data.body.userId)))
        console.log("FFF" + JSON.stringify(Object.fromEntries(new Map(members))))
        const v = [...members.values()];
        console.log("GGG" + JSON.stringify(v));
        // setTimeout(() => {
        // setMembersList(v);
        // }, 0)
        setMembersList([...members.values()])
        break;
      default:
        console.error(`Unknown data type: ${data.type}`);
        console.error(JSON.stringify(data));
    }
  });

  client.onMemberLeft((e) => {
    console.log(`onLeft: ${e.member.id}`)
    members.forEach((item, key) => {
      if (item.publisherId === e.member.id) {
        item.state = "offline"
        members.set(key, item);
      }
    });
  });

  function write(data: any) {
    client.write(data);
  }

  return (
    <>
    {console.log("update view" + [...members.values()].length)}
    {console.log(props.view)}
      <props.view write={write} members={[...members.values()]} />
    </>
  )
}
