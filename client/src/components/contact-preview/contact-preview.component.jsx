import { useState } from 'react';
import { useAuthentication } from '../../contexts/authentication-context';
import { useContacts } from '../../contexts/contacts-context';
import { useSidebar } from '../../contexts/sidebar-context';
import Contact from '../contact/contact.component';
import './contact-preview.styles.scss';

const ContactPreview = () => {
  const { friends, activeFriend, setActiveFriend } = useContacts();

  const handleClick = e => {
    const friendId = e.target.getAttribute('name');
    const activeFriend = friends.find(friend => friend._id === friendId);
    setActiveFriend(activeFriend);
  };

  return (
    <div className="contact-preview-container" onClick={handleClick}>
      {friends.length > 0 &&
        friends.map(({ _id, name, picture }) => (
          <div
            key={_id}
            name={_id}
            className={`contact-preview-list ${
              _id === activeFriend?._id ? 'active' : ''
            }`}
          >
            <div className="contact-preview-image-container">
              <img height="35px" src={picture} alt="profile" />
            </div>
            <p>{name}</p>
          </div>
        ))}
    </div>
  );
};

export default ContactPreview;
