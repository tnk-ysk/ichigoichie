import { useRef, useState } from 'react';
// import { useCookies } from 'react-cookie';
import { Link, useParams } from 'react-router-dom';
import { Member } from './Room';

export default function Search(props: {
  write: (data: any) => void,
  members: Map<string, Member>,
}) {
  // const members = useContext(MembersContext);
  // const members = props.members
  const { roomName } = useParams();
  const [memberList, setMemberList] = useState(createMemberList() as Member[]);
  const setting = JSON.parse(localStorage.getItem(roomName!) ?? '{}') as Member;

  // const [cookies] = useCookies(['setting']);

  const dataStreamInput = useRef<HTMLInputElement>(null);

  function write() {
    props.write(dataStreamInput.current!.value);
    dataStreamInput.current!.value = '';
  }

  function search(val: string) {

  }

  function createMemberList() {
    return [...props.members.values()].sort((a, b) => {
      let diff = 0;
      if (setting.attributes.length > 0) {
        diff = calcCosineSimilarity(setting.attributes, a.attributes) - calcCosineSimilarity(setting.attributes, b.attributes);
        if (diff !== 0) return diff;
      }
      diff = (a.state == 'online' ? 1 : 0) - (b.state == 'online' ? 1 : 0)
      if (diff !== 0) return diff;
      return a.userId > b.userId ? 1 : -1
    });
  }

  function calcCosineSimilarity(a: Array<string>, b: Array<string>) {
    return a.filter(item => b.indexOf(item) >= 0).length
      * Math.sqrt(1 / a.length) * Math.sqrt(1 / b.length);
  }

  return (
    <>
      <div>
        <input id="search" type="text" onChange={
          (e) => { search(e.target.value) }
        } />
        <Link to={`/${roomName}/setting`}>
          Setting
        </Link>
      </div>
      <ul>
        {memberList.map((item) => (
          <li key={item.userId}>

          </li>
        ))}
      </ul>
      <div>
        {/* <button id="join" onClick={join}>join</button> */}
      </div>



      <div>
        write dataStream: <input id="data-stream" type="text" ref={dataStreamInput} />
        <button id="write" onClick={write}>write</button>
      </div>
    </>
  )
}
