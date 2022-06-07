import { useState } from 'react';
import { useAuthentication } from '../../contexts/authentication-context';
import { useContacts } from '../../contexts/contacts-context';
import { useSidebar } from '../../contexts/sidebar-context';
import Contact from '../contact/contact.component';
import { MODAL_TYPE } from '../../contexts/sidebar-context';
import './contact-preview.styles.scss';

const ContactPreview = () => {
  const { friends } = useContacts();
  const { handleModal } = useSidebar();

  // const handleClick = e => {
  //   console.log('hey');
  //   const friendId = e.target.getAttribute('name');
  //   console.log(friendId);
  //   const activeFriend = friends.find(friend => friend._id === friendId);
  //   setActiveFriend(activeFriend);
  // };

  return (
    <div className="contact-preview-container">
      {friends.length > 0 &&
        friends.map(({ _id, name, picture }) => (
          <div
            onClick={e => handleModal(e, MODAL_TYPE.user, _id)}
            key={_id}
            name={_id}
            className="contact-preview-list"
          >
            <div className="contact-preview-image-container">
              <img height="100%" src={picture} alt="profile" />
            </div>
            <p>{name}</p>
          </div>
        ))}
    </div>
  );
};

export default ContactPreview;
