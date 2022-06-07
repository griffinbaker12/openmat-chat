import './chat-participant.styles.scss';

const ChatParticipant = ({ chatParticipant }) => {
  return (
    <div className="chat-participant-content-container">
      <div className="chat-participant-content-participant">
        {chatParticipant.name}
      </div>
      <div className="chat-participant-content-remove">&#x2715;</div>
    </div>
  );
};

export default ChatParticipant;
