import './contact.styles.scss';

const Contact = ({ active, contact: { username } }) => {
  return (
    <li
      name={username}
      className={`contact-list-item ${active ? 'active' : ''}`}
    >
      {username}
    </li>
  );
};

export default Contact;
