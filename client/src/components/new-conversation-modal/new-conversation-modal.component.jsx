import { useRef, useState } from 'react';
import ChatParticipant from '../chat-participant/chat-participant.component';
import { useConversations } from '../../contexts/conversations-context';
import './new-conversation-modal.styles.scss';

// There seems to also totally be room to just have one modal component, and also a genreal button component as well, but for the modal, essentially I can just pass in the name of the modal itself, and then the body of the modal. The 'children' can just be the unique part of the actual form for these components that gets inserted into the overall block of the component

// Will also need to add something where I can check if the user exists and as the person types have a little dropdown that can fill in suggestions? May not be necessary, but I know that discord does that and you can always @someone in that way, would be a nice feature to try and implement

const NewConversationModal = ({ closeModal }) => {
  const { createConversation } = useConversations();
  const [chatParticipants, setChatParticipants] = useState([]);
  const userNameRef = useRef();
  // const nameRef = useRef();

  // This is fine for now, I guess at some point I need to make it clear whether or not you can submit this when you hit enter, or whether hitting enter adds people to the chat if there are none, but then it probably should stary like that as well even afterwards so may make the other button a button type as well

  const handleSubmit = e => {
    e.preventDefault();
    createConversation(chatParticipants);
    closeModal();
    userNameRef.current.value = '';
    setChatParticipants([]);
    // Also need to clear the form here as well
  };

  const handleAddUser = () => {
    const user = userNameRef.current.value;
    // Will need to do some check to see if the actual user exists in the database or not
    // If they do exist...
    // This user may also at some point may also have some data on them besides just the userName, but suffices for now
    setChatParticipants(prevState => [...prevState, { userName: user }]);
    userNameRef.current.value = '';
  };

  return (
    <div className="new-conversation-modal-body">
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          ref={userNameRef}
          type="text"
          required={chatParticipants.length > 0 ? false : true}
        />
        <div className="new-conversation-modal-chat-participant-container">
          {chatParticipants.length !== 0 &&
            chatParticipants.map((chatParticipant, i) => (
              <ChatParticipant key={i} chatParticipant={chatParticipant} />
            ))}
        </div>
        <div className="new-conversation-modal-buttons">
          <button onClick={handleAddUser} type="button">
            Add User
          </button>
          <button type="submit">Create</button>
        </div>
      </form>
    </div>
  );
};

export default NewConversationModal;
