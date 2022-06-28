import { useChatView, MODAL_TYPE } from '../../contexts/chat-view-context';
import './contact-preview.styles.scss';

const ContactPreview = () => {
  const { friends, handleModal } = useChatView();

  // const handleClick = e => {
  //   console.log('hey');
  //   const friendId = e.target.getAttribute('name');
  //   console.log(friendId);
  //   const activeFriend = friends.find(friend => friend._id === friendId);
  //   setActiveFriend(activeFriend);
  // };

  return (
    <div className="contact-preview-container">
      {friends &&
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
