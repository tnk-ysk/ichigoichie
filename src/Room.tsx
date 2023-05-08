import { useRef, useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import WebRTC, { MembersContext } from './WebRTC'


export default function Room() {
  const members: Array<object> = useContext(MembersContext);

  useEffect(() => {
    (async function join() {
      await WebRTC.join(roomName!);
      WebRTC.onData((data: any) => {
        console.log("push");
        members.push(data);
      })
      // console.log("kita")

      myId.current!.textContent = WebRTC.member.id;

      // WebRTC.room.onMemberJoined.add((e) => {
      //   console.log(`join: ${e.member.id}`)
      // });
      // WebRTC.member.onPublicationSubscribed.add(async ({ stream, subscription }) => {
      //   if (stream.contentType !== 'data') return;
      //   console.log(`onPublicationSubscribed: ${subscription.publication.publisher.id}`);
      //   stream.onData.add((data) => {
      //     console.log(`data: ${data}`);
      //     members.push({});
      //   });
      // })
      // WebRTC.room.onMemberLeft.add((e) => {
      //   if (e.member.id === WebRTC.member.id) return;
      //   console.log(`${e.member.id} left ===`);
      // });

      // WebRTC.member.onLeft.add(() => {
      //   console.log("You left");
      // })
    })();
  }, []);
  useEffect(() => {
    console.log(`Members: ${JSON.stringify(members)}`)
  }, [JSON.stringify(members)]);
  // useEffect(() => () => console.log("unmount"), []);

  const { roomName } = useParams();
  const dataStreamInput = useRef<HTMLInputElement>(null);
  const myId = useRef<HTMLSpanElement>(null);
  const buttonArea = useRef<HTMLDivElement>(null);
  const remoteMediaArea = useRef<HTMLDivElement>(null);

  function write() {
    WebRTC.dataStream.write(dataStreamInput.current!.value);
    dataStreamInput.current!.value = '';
  }


  return (
    <>
      <Link to={`/${roomName}/setting`}>
        Setting
      </Link>
      <p>ID: <span id="my-id" ref={myId}></span></p>
      <div>
        {/* <button id="join" onClick={join}>join</button> */}
      </div>
      <div>
        write dataStream: <input id="data-stream" type="text" ref={dataStreamInput} />
        <button id="write" onClick={write}>write</button>
      </div>
      <div id="button-area" ref={buttonArea}></div>
      <div id="remote-media-area" ref={remoteMediaArea}></div>
    </>
  )
}
