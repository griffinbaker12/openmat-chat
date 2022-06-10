import { useState } from 'react';
import { ReactComponent as SearchIcon } from '../../assets/search.svg';
import ChatPreview from '../chat-preview/chat-preview.component';
import Modal from '../modal/modal.component';
import './side-bar.styles.scss';
import ContactPreview from '../contact-preview/contact-preview.component';
import Spinner from '../spinner/spinner.component';
import { useChatView, MODAL_TYPE } from '../../contexts/chat-view-context';

// Can extract the useEffect functionality to search for whatever it is that we need to search for in the actual context itself where the data lives / is stored

const SideBar = () => {
  const {
    search,
    isLoading,
    setSideBarCategory,
    updateSearchValue,
    handleSearchSubmit,
    handleModal,
    sideBarCategory,
  } = useChatView();

  const handleCategoryChange = e => {
    const clickedCategory = e.target.getAttribute('name');
    setSideBarCategory(clickedCategory);
  };

  // submit just get whatever that value was and actually set the search loading to true and all that jazz

  return (
    <div className="side-bar-container">
      <div className="side-bar-search-container">
        <form onSubmit={handleSearchSubmit}>
          <input
            onChange={updateSearchValue}
            value={search}
            type="search"
            placeholder="Search conversations and friends ..."
          />
          <SearchIcon className="search-icon" />
        </form>
        {/* You always want to search and query for the results, load a spinner in the mean time, and then when there is actually a result, just map over the results and render them here and then either open up the conversation or the profile of the person for which you are searching  
        
        - Handle the loading of the spinner, handle the displaying of the results with a new component inside if the actual header itself in a nice little dropdown
        */}
      </div>
      <div onClick={handleCategoryChange} className="side-bar-header-container">
        <div
          name="conversations"
          className={`side-bar-category ${
            sideBarCategory === 'conversations'
              ? 'side-bar-category-active'
              : ''
          } conversations`}
        >
          Conversations
        </div>
        <div
          name="friends"
          className={`side-bar-category ${
            sideBarCategory === 'friends' ? 'side-bar-category-active' : ''
          } contacts`}
        >
          Friends
        </div>
      </div>

      <div style={{ flex: '1' }}>
        {sideBarCategory === 'conversations' ? (
          isLoading ? (
            <Spinner type="search" />
          ) : (
            <ChatPreview />
          )
        ) : isLoading ? (
          <Spinner type="search" />
        ) : (
          <ContactPreview />
        )}
      </div>

      <button
        className="side-bar-container-generate-button"
        onClick={() => handleModal(MODAL_TYPE.sidebar)}
        type="button"
      >
        {sideBarCategory === 'conversations'
          ? 'New Conversation'
          : 'Add Friend'}
      </button>

      {<Modal />}
    </div>
  );
};

export default SideBar;
