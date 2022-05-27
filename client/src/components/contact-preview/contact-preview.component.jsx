import { useState } from 'react';
import { useContacts } from '../../contexts/contacts-context';
import Contact from '../contact/contact.component';
import './contact-preview.styles.scss';

const ContactPreview = () => {
  const [currentContact, setCurrentContact] = useState('');
  const { contacts } = useContacts();
  console.log('the current contact is', currentContact);

  const handleClick = e => {
    setCurrentContact(e.target.getAttribute('name'));
  };

  return (
    <div className="contact-preview-container" onClick={handleClick}>
      {contacts.length > 0 &&
        contacts.map((contact, i) => (
          <Contact
            active={contact.username === currentContact ? true : false}
            key={i}
            contact={contact}
          />
        ))}
    </div>
  );
};

export default ContactPreview;
