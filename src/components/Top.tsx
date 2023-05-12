import {
  uuidV4,
} from '@skyway-sdk/room';
import { useNavigate } from 'react-router-dom';

export default function Home() {

  const navigate = useNavigate();

  function createRoom() {
    const roomName = uuidV4();
    navigate(`/${roomName}`);
  }

  return (
    <>
      ichigoichie
      <button onClick={createRoom}>Create Room</button>
    </>
  )
}
