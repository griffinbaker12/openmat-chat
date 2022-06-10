import React, { Fragment } from 'react';
import { useRef, useState } from 'react';
import ChatParticipant from '../chat-participant/chat-participant.component';
import SearchResult from '../search-result/search-result-component';
import { toast } from 'react-toastify';
import { useChatView } from '../../contexts/chat-view-context';
import './new-conversation-modal.styles.scss';
import { useAuthentication } from '../../contexts/authentication-context';

// There seems to also totally be room to just have one modal component, and also a genreal button component as well, but for the modal, essentially I can just pass in the name of the modal itself, and then the body of the modal. The 'children' can just be the unique part of the actual form for these components that gets inserted into the overall block of the component

// Will also need to add something where I can check if the user exists and as the person types have a little dropdown that can fill in suggestions? May not be necessary, but I know that discord does that and you can always @someone in that way, would be a nice feature to try and implement

const NewConversationModal = () => {
  const { closeModal, chats, setChats } = useChatView();
  const { currentUser } = useAuthentication();

  const [chatParticipants, setChatParticipants] = useState([]);
  const [formInput, setFormInput] = useState({ chatName: '', name: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // So keep track of all the participants here, will need to search as well, then when we make the chat we send this to the api and push this into the current chat state of our application, also need to check to see if a chat with these users has already been made...

  // This is fine for now, I guess at some point I need to make it clear whether or not you can submit this when you hit enter, or whether hitting enter adds people to the chat if there are none, but then it probably should stary like that as well even afterwards so may make the other button a button type as well

  const resetForm = () => {
    closeModal();
    setChatParticipants([]);
    setSearchResults([]);
    setFormInput({ chatName: '', name: '' });
  };

  const handleChatCreation = async e => {
    e.preventDefault();

    // May want some sort of notification just letting them know that they need to enter something into the chat name field

    if (chatParticipants.length === 0) {
      toast.error('Please add users to chat', {
        position: 'bottom-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      return;
    }

    if (!formInput.chatName && chatParticipants.length !== 1) {
      toast.error('Please add name for group chat', {
        position: 'bottom-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      return;
    }

    // console.log(chats, 'chats');

    // I need to get the ids out of everyone in the current chat
    const mappedChatWithNames = chats.map(chat =>
      chat.users.map(({ userName }) => userName).sort()
    );
    // console.log(mappedChatWithNames, 'sorted uns');

    const sortedChatParticipants = [currentUser, ...chatParticipants]
      .map(user => user.userName)
      .sort();
    // console.log(sortedChatParticipants, 'sorted chat ps');

    const exists = mappedChatWithNames.some(chat => {
      if (chat.length !== sortedChatParticipants.length) return false;
      return chat.some((user, i) => user === sortedChatParticipants[i]);
    });

    if (exists) {
      toast.error('Chat between these users already exists', {
        position: 'bottom-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      return;
    }

    const chatName =
      chatParticipants.length === 1 ? 'solo chat' : formInput.chatName;

    const chatParticipantIds = chatParticipants.map(({ _id }) => _id);
    const payload = {
      chatName: chatName,
      users: chatParticipantIds,
    };

    try {
      const response = await fetch(
        `http://localhost:4000/api/chat/createChat`,
        {
          method: 'post',
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );
      const newChat = await response.json();
      setChats(prevState => [newChat, ...prevState]);
      resetForm();
      toast.success('Chat creation successful', {
        position: 'bottom-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    } catch (e) {
      toast.error('Error creating chat, please try again', {
        position: 'bottom-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
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
    } catch (e) {
      console.log('some error with search results');
    }
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
      <form onSubmit={handleChatCreation}>
        <label style={chatParticipants.length <= 1 ? { display: 'none' } : {}}>
          Chat Name
        </label>
        <input
          placeholder="Enter chat name..."
          onChange={handleChange}
          type="text"
          name="chatName"
          value={formInput.chatName}
          style={chatParticipants.length <= 1 ? { display: 'none' } : {}}
        />

        <label>User</label>
        <input
          placeholder="Search users..."
          onChange={handleChange}
          type="text"
          name="name"
          value={formInput.name}
        />
        {/* So in here we need the searched users as well as the selected users */}

        {/* Need to add some check here to only render when the length is over 0 so I do not get this error */}

        {chatParticipants.length === 0 ? (
          ''
        ) : (
          <div className="new-conversation-modal-chat-participant-container">
            {chatParticipants.map((chatParticipant, i) => (
              <Fragment key={i}>
                <ChatParticipant
                  chatParticipant={chatParticipant}
                  handleRemoveUser={handleRemoveUser}
                />
              </Fragment>
            ))}
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
          <button
            type="submit"
            className={`${
              searchResults.length === 0 ? 'button-no-search-results' : ''
            }`}
          >
            Create Chat
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewConversationModal;
