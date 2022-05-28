import './contact.styles.scss';

const Contact = ({ active, contact: { userName } }) => {
  return (
    <li
      name={userName}
      className={`contact-list-item ${active ? 'active' : ''}`}
    >
      {userName}
    </li>
  );
};

export default Contact;
