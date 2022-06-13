import { forwardRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import './search-result.styles.scss';

export const SEARCH_RESULT_TYPE = {
  default: 'default',
  addUserToExistingChat: 'addUserToExistingChat',
};

const SearchResult = ({ searchResult, handleAddUser, type }) => {
  const { _id } = searchResult;
  return (
    <div
      name={_id}
      onClick={handleAddUser}
      className={`search-result-container ${
        type === SEARCH_RESULT_TYPE.addUserToExistingChat
          ? 'add-user-to-existing-chat-container'
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
  );
};

export default SearchResult;
