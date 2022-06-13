import { forwardRef, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import './chat-participant.styles.scss';

const ChatParticipant = ({ chatParticipant, handleRemoveUser, ...rest }) => {
  const { _id, name } = chatParticipant;
  const node = useRef();

  return (
    <CSSTransition
      in={true}
      mountOnEnter
      unmountOnExit
      timeout={500}
      classNames="item"
      nodeRef={node}
    >
      <div ref={node} className="chat-participant-content-container">
        <div className="chat-participant-content-participant">{name}</div>
        <div
          name={_id}
          onClick={handleRemoveUser}
          className="chat-participant-content-remove"
        >
          &#x2715;
        </div>
      </div>
    </CSSTransition>
  );
};

export default ChatParticipant;
