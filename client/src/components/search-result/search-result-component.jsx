import { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import './search-result.styles.scss';

export const SEARCH_RESULT_TYPE = {
  default: 'default',
  addUserToExistingChat: 'addUserToExistingChat',
};

const SearchResult = ({
  chatParticipants,
  searchResult,
  handleAddUser,
  type,
}) => {
  const { _id } = searchResult;
  const nodeRef = useRef();

  return (
    <CSSTransition
      in={!chatParticipants.some(participant => participant._id === _id)}
      timeout={300}
      classNames="test"
      unmountOnExit
      mountOnEnter
      nodeRef={nodeRef}
    >
      <div
        ref={nodeRef}
        name={_id}
        onClick={handleAddUser}
        className={`search-result-container ${
          type === SEARCH_RESULT_TYPE.addUserToExistingChat
            ? 'add-user-to-existing-chat-container'
            : ''
        } ${
          chatParticipants.some(participant => participant._id === _id)
            ? 'removed'
            : ''
        } `}
      >
        <div className="search-result-image-container">
          <img height="100%" src={searchResult.picture} alt="profile" />
        </div>
        <div className="search-result-body-container">
          <div className="search-result-name">{searchResult.name}</div>
          <div className="search-result-username">@{searchResult.userName}</div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default SearchResult;
