import './chat-participant.styles.scss';

const ChatParticipant = ({ chatParticipant }) => {
  const { userName } = chatParticipant;

  return <div className="chat-participant-content">{userName}</div>;
};

export default ChatParticipant;
