import { Fragment, useState, useEffect, useRef } from 'react';
import { useAuthentication } from '../../contexts/authentication-context';
import { useChatView } from '../../contexts/chat-view-context';
import { TOAST_TYPE, defaultToast } from '../../utils/utils';
import SearchResult, {
  SEARCH_RESULT_TYPE,
} from '../search-result/search-result-component';
import './add-user-dropdown.styles.scss';

// If there is a solo chat, can add the user, but need to add another user to an existing chat as opposed to create an entirely new one. Also, need to make an adjustment once the chat goes from solo to group.

const AddUserDropdown = ({ wasSoloChat }) => {
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const addUserToChatRef = useRef();

  const { currentUser } = useAuthentication();
  const {
    activeChat,
    fetchChats,
    showAddUserInfoDropdown,
    chats,
    setActiveChat,
  } = useChatView();

  console.log('was solo chat from user dd', wasSoloChat);

  useEffect(() => {
    if (!addUserToChatRef.current) return;
    addUserToChatRef.current.focus();
  }, [showAddUserInfoDropdown]);

  const handleTextChange = async e => {
    const query = e.target.value;
    if (!query) {
      setUserSearchResults([]);
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

      const usersNotAlreadyInChat = users.filter(returnedUser => {
        return !activeChat[0].users.some(
          chatUser => returnedUser.userName === chatUser.userName
        );
      });

      setIsLoading(false);

      setUserSearchResults(usersNotAlreadyInChat);

      // May also want to filter these by who is not in the curent chat, or could do this on the back end as well but may not be the right nove there, but could jsut incluce a little flag to hanle on the BE
    } catch (e) {
      defaultToast(TOAST_TYPE.error, 'User already exists in chat');
    }
  };

  const handleAddUser = async e => {
    const closestContainer = e.target.closest(
      '.add-user-to-existing-chat-container'
    );
    const selectedId = closestContainer.getAttribute('name');

    // const alreadyExistsInCurrentChat = activeChat[0].users.some(
    //   user => user._id === selectedId
    // );

    // if (alreadyExistsInCurrentChat) {
    //   defaultToast(TOAST_TYPE.failure, 'Error adding user');
    //   return;
    // }

    // Search for if a chat already exists between the user that was just added
    // const alreadyExists = chats.some(chat => chat.users);

    const mappedChatWithNamesAndId = chats.map(chat => [
      chat.users.map(({ userName }) => userName).sort(),
      chat._id,
    ]);

    const selectedUser = userSearchResults.find(
      user => user._id === selectedId
    );

    const sortedChatUsers = [...activeChat[0].users, selectedUser]
      .map(user => user.userName)
      .sort();

    const existingChatUsersAndId = mappedChatWithNamesAndId.find(chat => {
      if (chat[0].length !== sortedChatUsers.length) return false;
      return chat[0].every((user, i) => user === sortedChatUsers[i]);
    });

    if (existingChatUsersAndId) {
      const existingChat = chats.find(
        chat => chat._id === existingChatUsersAndId[1]
      );
      setActiveChat([existingChat]);
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:4000/api/chat/addUserToChat',
        {
          method: 'put',
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatId: activeChat[0]._id,
            userId: selectedId,
          }),
        }
      );
      const newChat = await response.json();
      fetchChats();
      defaultToast(TOAST_TYPE.success, 'User successfully added');
    } catch (error) {
      defaultToast(TOAST_TYPE.failure, 'Error adding user');
    }

    // setChatParticipants(prevState => [...prevState, selectedUser]);
    // setFormInput(prevState => ({ ...prevState, name: '' }));
  };

  const handleLeaveChat = e => {
    // Here Ia m going to need to see who the current user is and then send them to the backend and then I guess just refetch the chats? Is that what he does just to reset everything? I guess that make sure the whole state is current
  };
  // const addUserInputRef = useRef();

  // const handleKeyDown = e => {
  //   console.log('hello?');
  // };

  // useEffect(() => {
  //   if (!addUserInputRef.current) return;
  //   const keypress = new Event('keydown', {
  //     bubbles: true,
  //     cancelable: true,
  //     keycode: 32,
  //     which: 32,
  //   });
  //   addUserInputRef.current.focus();
  //   addUserInputRef.current.dispatchEvent(keypress);
  // }, [showAddUserDropdown]);

  return (
    <div className="add-user-dropdown-container">
      <div className="add-user-dropdown-tip bottom">
        <div className="add-user-dropdown-content-container">
          <input
            type="search"
            placeholder="Search users..."
            onChange={handleTextChange}
            ref={addUserToChatRef}
          />
          <div className="add-user-dropdown-results-container">
            {userSearchResults.map((searchResult, i) => (
              <Fragment key={i}>
                <SearchResult
                  type={SEARCH_RESULT_TYPE.addUserToExistingChat}
                  handleAddUser={handleAddUser}
                  searchResult={searchResult}
                />
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserDropdown;
