import React, { createRef, useEffect } from 'react';
import { useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ChatParticipant from '../chat-participant/chat-participant.component';
import SearchResult from '../search-result/search-result-component';
import Spinner from '../spinner/spinner.component';
import { toast } from 'react-toastify';
import { useChatView } from '../../contexts/chat-view-context';
import './new-conversation-modal.styles.scss';
import { useAuthentication } from '../../contexts/authentication-context';
import { defaultToast, TOAST_TYPE } from '../../utils/utils';

// There seems to also totally be room to just have one modal component, and also a genreal button component as well, but for the modal, essentially I can just pass in the name of the modal itself, and then the body of the modal. The 'children' can just be the unique part of the actual form for these components that gets inserted into the overall block of the component

// Will also need to add something where I can check if the user exists and as the person types have a little dropdown that can fill in suggestions? May not be necessary, but I know that discord does that and you can always @someone in that way, would be a nice feature to try and implement

const NewConversationModal = () => {
  const { closeModal, chats, setChats } = useChatView();
  const { currentUser } = useAuthentication();

  const [chatParticipants, setChatParticipants] = useState([]);
  const [formInput, setFormInput] = useState({ chatName: '', name: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchResultRef = useRef(null);

  const [showChatParticipants, setShowChatParticipants] = useState(false);
  // The other approach would be to somehow create an array of refs and that makes sense why the ref would disappear after you delete the element but it works when it actually loads on the page
  const chatParticipantRef = useRef(null);

  // So keep track of all the participants here, will need to search as well, then when we make the chat we send this to the api and push this into the current chat state of our application, also need to check to see if a chat with these users has already been made...

  // This is fine for now, I guess at some point I need to make it clear whether or not you can submit this when you hit enter, or whether hitting enter adds people to the chat if there are none, but then it probably should stary like that as well even afterwards so may make the other button a button type as well

  const resetForm = () => {
    setShowChatParticipants(false);
    setShowSearchResults(false);
    setChatParticipants([]);
    setSearchResults([]);
    setFormInput({ chatName: '', name: '' });
  };

  const handleClick = () => resetForm();

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  });

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

    const sortedChatParticipants = [currentUser, ...chatParticipants]
      .map(user => user.userName)
      .sort();

    const exists = mappedChatWithNames.some(chat => {
      if (chat.length !== sortedChatParticipants.length) return false;
      return chat.every((user, i) => user === sortedChatParticipants[i]);
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
      chatParticipants.length === 1 ? 'null' : formInput.chatName;

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
      closeModal();
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

    if (!query) {
      setShowSearchResults(false);
      setSearchResults([]);
      return;
    }

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
      if (!users.length) {
        setShowSearchResults(false);
        setIsLoading(false);
        return;
      }
      const filteredUsers = users.filter(
        user =>
          !chatParticipants.some(participant => user._id === participant._id)
      );
      if (!filteredUsers.length) {
        setShowSearchResults(false);
        setIsLoading(false);
        setSearchResults(filteredUsers);
        return;
      }
      setIsLoading(false);
      setShowSearchResults(true);
      setSearchResults(filteredUsers);
    } catch (e) {
      toast.error('Error fetching search results', {
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
  };

  const handleAddUser = e => {
    const closestContainer = e.target.closest('.search-result-container');
    const selectedId = closestContainer.getAttribute('name');
    const alreadyExists = chatParticipants.some(
      participant => participant._id === selectedId
    );

    if (alreadyExists) {
      defaultToast(TOAST_TYPE.failure, 'Cannot add duplicate user');
      return;
    }

    if (searchResults.length === 1) {
      setShowSearchResults(false);
    }

    const selectedUser = searchResults.find(
      result => result?._id === selectedId
    );

    const filteredUsers = searchResults.filter(
      result => selectedUser._id !== result._id
    );

    setChatParticipants(prevState => [...prevState, selectedUser]);
    setShowChatParticipants(true);
    setSearchResults(filteredUsers);
  };

  const handleRemoveUser = e => {
    const selectedId = e.target.getAttribute('name');
    const removedUser = chatParticipants.find(
      participant => participant._id === selectedId
    );
    const newParticipants = chatParticipants.filter(
      participant => participant._id !== selectedId
    );
    if (newParticipants.length === 0) setShowChatParticipants(false);
    setChatParticipants(newParticipants);
    setSearchResults(prevState => [...prevState, removedUser]);
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

        <CSSTransition
          in={showChatParticipants}
          classNames="chat-participants"
          timeout={500}
          nodeRef={chatParticipantRef}
          mountOnEnter
          unmountOnExit
        >
          <div
            style={{ display: 'flex', justifyContent: 'center' }}
            ref={chatParticipantRef}
          >
            <TransitionGroup className="new-conversation-modal-chat-participant-container">
              {chatParticipants.map(chatParticipant => {
                const participantRef = createRef();
                return (
                  <CSSTransition
                    key={chatParticipant._id}
                    classNames="chat-participant"
                    timeout={500}
                    nodeRef={participantRef}
                  >
                    <div ref={participantRef}>
                      <ChatParticipant
                        chatParticipant={chatParticipant}
                        handleRemoveUser={handleRemoveUser}
                      />
                    </div>
                  </CSSTransition>
                );
              })}
            </TransitionGroup>
          </div>
        </CSSTransition>

        {isLoading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '4px',
              paddingBottom: '8px',
            }}
          >
            <Spinner />
          </div>
        ) : (
          <CSSTransition
            in={showSearchResults}
            classNames="search-results"
            timeout={500}
            nodeRef={searchResultRef}
            mountOnEnter
            unmountOnExit
          >
            <div ref={searchResultRef}>
              <TransitionGroup
                className="new-conversation-modal-chat-search-result-container"
                timeout={500}
              >
                {searchResults.map(searchResult => {
                  const resultRef = createRef();
                  return (
                    <CSSTransition
                      key={searchResult._id}
                      classNames="search-result"
                      timeout={500}
                      nodeRef={resultRef}
                    >
                      <div ref={resultRef}>
                        <SearchResult
                          handleAddUser={handleAddUser}
                          searchResult={searchResult}
                        />
                      </div>
                    </CSSTransition>
                  );
                })}
              </TransitionGroup>
            </div>
          </CSSTransition>
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
