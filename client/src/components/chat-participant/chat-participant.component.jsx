import './chat-participant.styles.scss';

const ChatParticipant = ({ chatParticipant, handleRemoveUser }) => {
  const { _id, name } = chatParticipant;

  return (
    <div className="chat-participant-content-container">
      <div className="chat-participant-content-participant">{name}</div>
      <div
        name={_id}
        onClick={handleRemoveUser}
        className="chat-participant-content-remove"
      >
        &#x2715;
      </div>
    </div>
  );
};

export default ChatParticipant;
