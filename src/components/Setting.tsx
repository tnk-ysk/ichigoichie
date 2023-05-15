import { uuidV4 } from '@skyway-sdk/token';
import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Member } from './Room';

export default function Setting(props: {
  write: (data: any) => void,
  members: Array<Member>,
}) {
  const { roomName } = useParams();
  // const [cookies, setCookie] = useCookies([roomName!]);
  const setting = JSON.parse(localStorage.getItem(roomName!) ?? '{}');

  const userId: string = setting.userId ?? uuidV4();
  const [userName, setUserName] = useState((setting.userName ?? "") as string);
  const [attributes, setAttributes] = useState((setting.attributes ?? []) as string[]);
  let changed = false;

  const attributeInput = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    const setting = {
      userId: userId,
      publisherId: "",
      userName: userName,
      attributes: attributes,
    };
    localStorage.setItem(roomName!, JSON.stringify(setting));
    changed = true;
  }, [userName, attributes]);

  useEffect(() => {
    return () => {
      if (!changed) return;
      props.write({
        type: "update",
        body: {
          userId: userId,
          userName: userName,
          attributes: attributes,
          state: 'online',
        },
      })
    }
  }, [])

  function addAttribute() {
    const val = attributeInput.current.value
    if (val === "") return;
    attributeInput.current.value = "";
    if (attributes.indexOf(val) >= 0) return;
    setAttributes([...attributes, val]);
  }

  function removeAttribute(attribute: string) {
    setAttributes(attributes.filter((item) => item !== attribute))
  }

  return (
    <>
      {console.log(JSON.stringify(attributes))}
      <div>
        <Link to={`/${roomName}`}>
          Room
        </Link>
      </div>
      <div>
        <input id="userName" type="text" value={userName} onChange={
          (e) => { setUserName(e.target.value) }
        } />
      </div>
      <div>
        <input id="attribute" type="text" ref={attributeInput} onKeyDown={(
          (e) => { if (e.key === 'Enter') addAttribute() }
        )} />
        <button id="addAttribute" onClick={addAttribute}>+</button>
      </div>
      <ul className="attributes">
        {attributes.map((item: string) => (
          <li key={item}>
            <span className="name">{item}</span>
            <button onClick={() => { removeAttribute(item) }}>x</button>
          </li>
        ))}
      </ul>
    </>
  )
}
