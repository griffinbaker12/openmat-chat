import { forwardRef, useRef, useEffect, useState } from 'react';
import { useAuthentication } from '../../contexts/authentication-context';
import { useChatView } from '../../contexts/chat-view-context';
import {
  generateChatNameForSoloChats,
  defaultToast,
  TOAST_TYPE,
} from '../../utils/utils';
import './notification-dropdown.styles.scss';

const NotificationDropdown = forwardRef(
  (
    { handleDropdown, closeAccountDropdown, closeNotificationDropdown },
    ref
  ) => {
    const {
      notifications,
      setActiveChat,
      chats,
      setNotifications,
      setUnreadMessages,
    } = useChatView();
    const { currentUser } = useAuthentication();
    const [groupedNotifications, setGroupedNotifications] = useState([]);
    const dropDownRef = useRef();

    const handleSignOutClick = e => {
      if (ref.current === e.target.closest('.header-chat-link')) {
        return;
      }
      if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
        closeNotificationDropdown();
      }
    };

    useEffect(() => {
      document.addEventListener('mousedown', handleSignOutClick);
      return () =>
        document.removeEventListener('mousedown', handleSignOutClick);
    });

    useEffect(() => {
      const chatCounter = [];
      if (notifications.length === 0) return;
      notifications.forEach(notification => {
        const alreadyInCounterIndex = chatCounter.findIndex(
          notificaitonInChatCounter =>
            notificaitonInChatCounter.chat._id === notification.message.chat._id
        );
        if (alreadyInCounterIndex >= 0) {
          let objToInc = chatCounter[alreadyInCounterIndex];
          objToInc.count = objToInc.count + 1;
        } else {
          chatCounter.push({ chat: notification.message.chat, count: 1 });
        }
      });
      setGroupedNotifications(chatCounter);
    }, [notifications]);

    const handleNotificationClick = async e => {
      const chatId = e.target
        .closest('.notification-dropdown-content-item-container')
        .getAttribute('name');
      const chat = chats.find(chat => chat._id === chatId);
      setActiveChat([chat]);
      const unreadNotificationsInChat = notifications.filter(
        notification => notification.chat._id === chatId
      );
      setUnreadMessages(unreadNotificationsInChat);

      // Should remove all notifications for a certain user in a chat; test this with postman
      try {
        const response = await fetch(
          `http://localhost:4000/api/notification/removeNotification`,
          {
            method: 'post',
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chatId: chat._id,
            }),
          }
        );
        const updatedNotifications = await response.json();
        setNotifications(updatedNotifications);
      } catch (error) {
        defaultToast(TOAST_TYPE.error, 'Error updating notifications');
      }
    };

    return (
      <div
        onClick={handleSignOutClick}
        ref={dropDownRef}
        className="notification-dropdown-container"
      >
        {notifications.length === 0 ? (
          <p
            style={{
              padding: '20px',
              textAlign: 'center',
            }}
          >
            No new notifications!
          </p>
        ) : (
          groupedNotifications.map((groupedNotification, i) => (
            <div
              onClick={handleNotificationClick}
              name={groupedNotification.chat._id}
              key={i}
              className="notification-dropdown-content-item-container"
            >
              <p>
                {groupedNotification.count === 1
                  ? 'New message'
                  : `${groupedNotification.count} new messages`}{' '}
                {groupedNotification.chat.isGroupChat
                  ? `in ${groupedNotification.chat.chatName}`
                  : `from ${generateChatNameForSoloChats(
                      groupedNotification.chat.users,
                      currentUser
                    )}`}
              </p>
            </div>
          ))
        )}
      </div>
    );
  }
);
export default NotificationDropdown;
