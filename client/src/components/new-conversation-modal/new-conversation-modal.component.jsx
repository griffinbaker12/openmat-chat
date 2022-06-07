import { useRef, useState } from 'react';
import ChatParticipant from '../chat-participant/chat-participant.component';
import { useConversations } from '../../contexts/conversations-context';
import './new-conversation-modal.styles.scss';
import { useSidebar } from '../../contexts/sidebar-context';
import { useAuthentication } from '../../contexts/authentication-context';

// There seems to also totally be room to just have one modal component, and also a genreal button component as well, but for the modal, essentially I can just pass in the name of the modal itself, and then the body of the modal. The 'children' can just be the unique part of the actual form for these components that gets inserted into the overall block of the component

// Will also need to add something where I can check if the user exists and as the person types have a little dropdown that can fill in suggestions? May not be necessary, but I know that discord does that and you can always @someone in that way, would be a nice feature to try and implement

const NewConversationModal = () => {
  const { closeModal } = useSidebar();
  const { createConversation } = useConversations();
  const [chatParticipants, setChatParticipants] = useState([]);
  const [formInput, setFormInput] = useState({ chatName: '', name: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuthentication();
  const [searchResults, setSearchResults] = useState([]);

  // So keep track of all the participants here, will need to search as well, then when we make the chat we send this to the api and push this into the current chat state of our application, also need to check to see if a chat with these users has already been made...

  // This is fine for now, I guess at some point I need to make it clear whether or not you can submit this when you hit enter, or whether hitting enter adds people to the chat if there are none, but then it probably should stary like that as well even afterwards so may make the other button a button type as well

  const handleSubmit = e => {
    // // Will need to check somewhere to see if this person has already been added to the conversation, if they have, then don't allow them to create the convo. I also need a better UI that allows you to hit the enter button to add a user, but not submit the form and close the modal.
    e.preventDefault();
    handleAddUser();
  };

  const handleChatCreation = () => {
    if (chatParticipants.length === 0) return;

    // createConversation(chatParticipants);
    // closeModal();
    // setFormInput({ chatName: '', name: '' });
    // setChatParticipants([]);
  };

  const handleChange = async e => {
    const field = e.target.getAttribute('name');
    setFormInput(prevState => ({ ...prevState, [field]: e.target.value }));

    // If we are typing into the name field, then we want to make a fetch reqeust with the current value of the input
    if (field !== 'name') return;
    const query = formInput.name;

    try {
      fetch('');
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:4000/api/user?search=${query}`,
        {
          method: 'get',
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }
      );
      const { users } = await response.json();
      console.log(users);
      setIsLoading(false);
      setSearchResults(users);
    } catch (e) {}
  };

  const handleAddUser = () => {
    // const user = userNameRef.current.value;
    if (!formInput.name) return;
    // Will need to do some check to see if the actual user exists in the database or not
    // If they do exist...
    // This user may also at some point may also have some data on them besides just the userName, but suffices for now
    setChatParticipants(prevState => [...prevState, formInput.name]);
    setFormInput(prevState => ({ ...prevState, name: '' }));
  };

  return (
    <div className="new-conversation-modal-body">
      <form onSubmit={handleSubmit}>
        <label>Chat Name</label>
        <input
          onChange={handleChange}
          type="text"
          required={true}
          name="chatName"
          value={formInput.chatName}
        />
        <label>Name</label>
        <input
          onChange={handleChange}
          type="text"
          required={chatParticipants.length > 0 ? false : true}
          name="name"
          value={formInput.name}
        />
        {/* So in here we need the searched users as well as the selected users */}
        <div className="new-conversation-modal-chat-participant-container">
          {chatParticipants.length !== 0 &&
            chatParticipants.map((chatParticipant, i) => (
              <ChatParticipant key={i} chatParticipant={chatParticipant} />
            ))}
        </div>
        <div className="new-conversation-modal-chat-search-result-container">
          {isLoading ? searchResults.length !== 0 &&
            chatParticipants.map((chatParticipant, i) => (
              <ChatParticipant key={i} chatParticipant={chatParticipant} />
            ))}
        </div>
        <div className="new-conversation-modal-buttons">
          <button onClick={handleAddUser} type="button">
            Add User
          </button>
          <button type="button" onClick={handleChatCreation}>
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewConversationModal;
