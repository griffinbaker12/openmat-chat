import { forwardRef, useRef, useEffect, useState } from 'react';
import { useAuthentication } from '../../contexts/authentication-context';
import { useChatView } from '../../contexts/chat-view-context';
import { generateChatNameForSoloChats } from '../../utils/utils';
import './notification-dropdown.styles.scss';

const NotificationDropdown = forwardRef(
  (
    { handleDropdown, closeAccountDropdown, closeNotificationDropdown },
    ref
  ) => {
    const { notifications } = useChatView();
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
      notifications.forEach(notification => {
        const alreadyInCounterIndex = chatCounter.findIndex(
          notificaitonInChatCounter =>
            notificaitonInChatCounter.chat._id === notification.message.chat._id
        );
        console.log(alreadyInCounterIndex);
        if (alreadyInCounterIndex >= 0) {
          let objToInc = chatCounter[alreadyInCounterIndex];
          objToInc.count = objToInc.count + 1;
        } else {
          chatCounter.push({ chat: notification.message.chat, count: 1 });
        }
      });
      setGroupedNotifications(chatCounter);
    }, [notifications]);

    console.log(groupedNotifications, 'gns');

    return (
      <div
        onClick={handleSignOutClick}
        ref={dropDownRef}
        className="notification-dropdown-container"
      >
        {notifications.length === 0 ? (
          <p>No new notifications!</p>
        ) : (
          groupedNotifications.map((groupedNotification, i) => (
            <div
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
