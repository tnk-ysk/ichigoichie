import React, { useContext, useState, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { Link, useParams } from 'react-router-dom';
import { appId, secret } from './env';

// export const MembersContext = React.createContext(new Object());

export default function Search(props: { write: (data: any) => void, members: object }) {
  // const members = useContext(MembersContext);
  const members = props.members
  const { roomName } = useParams();
  const [cookies] = useCookies(['setting']);

  const dataStreamInput = useRef<HTMLInputElement>(null);
  const myId = useRef<HTMLSpanElement>(null);
  const buttonArea = useRef<HTMLDivElement>(null);
  const remoteMediaArea = useRef<HTMLDivElement>(null);

  function write() {
    props.write(dataStreamInput.current!.value);
    dataStreamInput.current!.value = '';
  }

  return (
    <>
      <Link to={`/${roomName}/setting`}>
        Setting
      </Link>

      <p>{JSON.stringify(members)}</p>
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
