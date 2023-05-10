// import React, { useContext, useState, useRef } from 'react';
// import { useCookies } from 'react-cookie';
import { useParams, Link } from 'react-router-dom';
// import { appId, secret } from './env';

export default function Setting(_: { write: (data: any) => void, members: object }) {
  const { roomName } = useParams();
  // const [cookies] = useCookies(['setting']);

  return (
    <>
      <Link to={`/${roomName}`}>
        Room
      </Link>
      <div>setting</div>
    </>
  )
}
