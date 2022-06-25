import { Fragment, useState, useEffect, useRef } from 'react';
import { useAuthentication } from '../../contexts/authentication-context';
import { useChatView } from '../../contexts/chat-view-context';
import { useSocket } from '../../contexts/socket-context';
import { TOAST_TYPE, defaultToast } from '../../utils/utils';
import SearchResult, {
  SEARCH_RESULT_TYPE,
} from '../search-result/search-result-component';
import './add-user-dropdown.styles.scss';

const AddUserDropdown = ({ wasSoloChat }) => {
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const addUserToChatRef = useRef();

  const { currentUser } = useAuthentication();
  const { activeChat, showAddUserInfoDropdown, chats, setActiveChat } =
    useChatView();
  const { socket } = useSocket();

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
    } catch (e) {
      defaultToast(TOAST_TYPE.error, 'User already exists in chat');
    }
  };

  // LETS LOOK AT THIS FIRST THING TOMORROW. WHEN YOU CREATE A SOLO CHAT AND THEN ADD SOMEONE TO THE CHAT WITH THAT PERSON, YOU GET WEIRD BEHAVIOR AND THEY GET GROUPED TOGETHER IN THE SAME CHAT. BUT THEN AFTER WE KNOCK THAT OUT, WE JUST DO THE LAST MESSAGES AND WHETHER THEY HAVE BEEN READ (JUST USE STATE AND CHECK WHETHER THEY HAVE BEEN READ; CAN STORE THEM IN AN OBJECT WITH THE MESSAGE, SENDER, TEXT, AND READ STATUS) - WHEN YOU ADD A MESSAGE IT GOES TO UNREAD BUT THEN WHEN YOU CLICK IT GOES TO READ. THEN WE JUST HANDLE NOTIFICATIONS AND WE ARE DONEZO :)

  const handleAddUser = async e => {
    const closestContainer = e.target.closest(
      '.add-user-to-existing-chat-container'
    );
    const selectedId = closestContainer.getAttribute('name');

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

    console.log(existingChatUsersAndId);

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
      if (!newChat.latestMessage) {
        socket.emit('chat update', newChat, currentUser, null, true);
      } else {
        socket.emit('chat update', newChat, null, null, true);
      }
      defaultToast(TOAST_TYPE.success, 'User successfully added');
    } catch (error) {
      defaultToast(TOAST_TYPE.failure, 'Error adding user');
    }
  };

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
