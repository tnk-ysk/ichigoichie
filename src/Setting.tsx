import { useParams, Link } from 'react-router-dom'

export default function Setting() {
  const { roomName } = useParams();

  return (
    <>
      <Link to={`/${roomName}`}>
        Room
      </Link>
    </>
  )
}
