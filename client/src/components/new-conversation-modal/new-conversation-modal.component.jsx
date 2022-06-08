import { Fragment } from 'react';
import { useRef, useState } from 'react';
import ChatParticipant from '../chat-participant/chat-participant.component';
import SearchResult from '../search-result/search-result-component';
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
  const { chats, setChats } = useSidebar();

  // So keep track of all the participants here, will need to search as well, then when we make the chat we send this to the api and push this into the current chat state of our application, also need to check to see if a chat with these users has already been made...

  // This is fine for now, I guess at some point I need to make it clear whether or not you can submit this when you hit enter, or whether hitting enter adds people to the chat if there are none, but then it probably should stary like that as well even afterwards so may make the other button a button type as well

  const handleChatCreation = () => {
    if (chatParticipants.length === 0) return;

    console.log(chats, 'chats');

    // I need to get the ids out of everyone in the current chat
    const mappedChatWithNames = chats.map(chat =>
      chat.users.map(user => user.name).sort()
    );
    console.log(mappedChatWithNames);

    // createConversation(chatParticipants);
    // closeModal();
    // setFormInput({ chatName: '', name: '' });
    // setChatParticipants([]);
  };

  const handleChange = async e => {
    const field = e.target.getAttribute('name');
    const query = e.target.value;
    setFormInput(prevState => ({ ...prevState, [field]: query }));

    // If we are typing into the name field, then we want to make a fetch reqeust with the current value of the input
    if (field !== 'name') return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:4000/api/user?search=${query}`,
        {
          method: 'get',
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }
      );
      const { users } = await response.json();
      // console.log(users);
      setIsLoading(false);
      setSearchResults(users);
    } catch (e) {}
  };

  const handleAddUser = e => {
    const closestContainer = e.target.closest('.search-result-container');
    const selectedId = closestContainer.getAttribute('name');
    const alreadyExists = chatParticipants.some(
      participant => participant._id === selectedId
    );

    if (alreadyExists) {
      return;
    }

    const selectedUser = searchResults.find(
      result => result?._id === selectedId
    );

    setChatParticipants(prevState => [...prevState, selectedUser]);
    setFormInput(prevState => ({ ...prevState, name: '' }));
  };

  const handleRemoveUser = e => {
    const selectedId = e.target.getAttribute('name');
    const newParticipants = chatParticipants.filter(
      participant => participant._id !== selectedId
    );
    console.log('new recip', newParticipants);
    setChatParticipants(newParticipants);
  };

  return (
    <div className="new-conversation-modal-body">
      <form>
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

        {/* Need to add some check here to only render when the length is over 0 so I do not get this error */}

        {chatParticipants.length === 0 ? (
          ''
        ) : (
          <div className="new-conversation-modal-chat-participant-container">
            {chatParticipants.map((chatParticipant, i) => {
              console.log(chatParticipants);
              return (
                <Fragment key={i}>
                  <ChatParticipant
                    chatParticipant={chatParticipant}
                    handleRemoveUser={handleRemoveUser}
                  />
                </Fragment>
              );
            })}
          </div>
        )}
        {searchResults.length === 0 ? (
          ''
        ) : (
          <div className="new-conversation-modal-chat-search-result-container">
            {searchResults.map((searchResult, i) => (
              <Fragment key={i}>
                <SearchResult
                  handleAddUser={handleAddUser}
                  searchResult={searchResult}
                />
              </Fragment>
            ))}
          </div>
        )}
        <div className="new-conversation-modal-buttons">
          <button type="button" onClick={handleChatCreation}>
            Create Chat
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewConversationModal;
