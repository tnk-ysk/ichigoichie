import { useEffect, useRef, useState } from 'react';
// import { useCookies } from 'react-cookie';
import { Link, useParams } from 'react-router-dom';
import { Member } from './Room';

export default function Search(props: {
  write: (data: any) => void,
  members: Array<Member>,
}) {

  // const members = useContext(MembersContext);
  // const members = props.members
  const { roomName } = useParams();
  let memberList = sortMemberList(props.members);
  console.log("update!!!!" + JSON.stringify(memberList));
  const [filtterdMemberList, setFiltteredMemberList] = useState([] as Member[]);
  // console.log("update!!!!2" + JSON.stringify(filtterdMemberList));
  const setting = JSON.parse(localStorage.getItem(roomName!) ?? '{}') as Member;

  const searchInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    console.log("kita")
    memberList = sortMemberList(props.members);
    search();
  }, [props.members])

  // const [cookies] = useCookies(['setting']);

  // function write() {
  //   props.write(dataStreamInput.current!.value);
  //   dataStreamInput.current!.value = '';
  // }
  // useEffect(() => {
  //   setFiltteredMemberList
  // }, [memberList]);

  function search() {
    const text = searchInput.current!.value;
    let m = memberList;
    // TODO: multi space
    for (const t of text.split(" ")) {
      m = m.filter((item) => {
        item.userName.includes(t) || item.attributes.find((value) => {
          return value.includes(t);
        }) !== undefined
      });
    }
    setFiltteredMemberList(m);
  }

  function sortMemberList(members: Member[]) {
    return members.sort((a, b) => {
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
        <input id="search" type="text" ref={searchInput} onChange={search} />
        <Link to={`/${roomName}/setting`}>
          Setting
        </Link>
      </div>
      <ul>
        {filtterdMemberList.map((item) => (
          <li key={item.userId}>
            <div>{item.userName}</div>
            <ul>
              {item.attributes.map((attr) => (
                <li>{attr}</li>
              ))}
            </ul>
            <div>{item.userId}</div>
            <div>{item.state}</div>

          </li>
        ))}
      </ul>
    </>
  )
}
