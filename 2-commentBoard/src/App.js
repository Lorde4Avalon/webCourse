import "./App.css";
import { useLocalStorage } from "react-use";
import { useState } from "react";

function App() {
  const [comments, setComments] = useLocalStorage("comments", [
    {
      name: "John",
      text: "Hello, world!",
      time: Date.now(),
      children: [],
    },
  ]);

  function newComment(comment) {
    setComments([...comments, comment]);
  }

  return (
    <div className="App">
      <div className="header"> Comment Board </div>
      <CommentEditor onSubmit={newComment} />
      <div className="comment-header">Comments</div>
      {Array.from(comments)
        .reverse()
        .map((item) => (
          <Comment
            item={item}
            delete={() => setComments(comments.filter((c) => c !== item))}
            edit={(updatedComment) => {
              setComments(
                comments.map((c) => (c === item ? updatedComment : c))
              );
            }}
          />
        ))}
    </div>
  );
}

function Comment(props) {
  const { item } = props;
  const [edit, setEdit] = useState(false);
  const [reply, setReply] = useState(false);
  return edit ? (
    <CommentEditor
      text={props.item.text}
      name={props.item.name}
      editing={true}
      onSubmit={(submited) => {
        props.edit({
          name: submited.name,
          text: submited.text,
          time: props.item.time,
        });
        setEdit(false);
      }}
    />
  ) : (
    <div className="comment">
      <img
        className="avatar"
        src={`https://avatars.githubusercontent.com/${props.item.name}?s=64`}
      />
      <div className="info">
        <div className="name">{props.item.name}</div>
        <div className="time">{new Date(props.item.time).toLocaleString()}</div>
      </div>
      <div className="text">{props.item.text}</div>
      <div className="actions">
        <button className="edit" onClick={() => setEdit(true)}>
          Edit
        </button>
        <button className="delete" onClick={props.delete}>
          Delete
        </button>
        <button className="reply" onClick={() => setReply(!reply)}>
          Reply
        </button>
      </div>
      {item.children.map((child) => (
        <Comment
          item={child}
          delete={() => props.edit({
            ...item,
            children: item.children.filter((c) => c !== child),
          })}
          edit={(updatedComment) => props.edit({
            ...item,
            children: item.children.map(x => x.time === child.time ? updatedComment : x),
          })}
        />
      ))}
      {reply && (
        <CommentEditor
          onSubmit={(comment) => {
            props.edit({
              ...item,
              children: [...item.children, comment ],
            });
            setReply(false);
          }}
        />
      )}
    </div>
  );
}

function CommentEditor(props) {
  const [text, setText] = useState(props.text || "");
  const [name, setName] = useState(props.name || "");
  function onSubmit() {
    props.onSubmit({ name, text, time: Date.now(), children: [] });
    setText("");
    setName("");
  }
  return (
    <div className="editor">
      <img
        className="avatar"
        src={`https://avatars.githubusercontent.com/${name || "github"}?s=64`}
      />
      <label htmlFor="name">Name:</label>
      <br />
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={!!props.editing}
      />
      <br />
      <label htmlFor="text">Comment:</label>
      <br />
      <textarea
        type="text"
        id="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <button onClick={onSubmit}>Submit</button>
    </div>
  );
}

export default App;
