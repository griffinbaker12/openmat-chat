import { Fragment, useState, useEffect, useRef } from 'react';
import { useAuthentication } from '../../contexts/authentication-context';
import { TOAST_TYPE, defaultToast } from '../../utils/utils';
import SearchResult, {
  SEARCH_RESULT_TYPE,
} from '../search-result/search-result-component';
import './add-user-dropdown.styles.scss';

const AddUserDropdown = ({ showAddUserDropdown, setShowAddUserdropdown }) => {
  // const [userSearchText, setUserSearchText] = useState('');
  const [userToAdd, setUserToAdd] = useState('');
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useAuthentication();

  const handleTextChange = async e => {
    const query = e.target.value;
    console.log(query);
    if (!query) {
      console.log('hey');
      setUserSearchResults([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:4000/api/user?search=${query}`,
        {
          method: 'get',
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }
      );
      const { users } = await response.json();
      setIsLoading(false);
      setUserSearchResults(users);

      // May also want to filter these by who is not in the curent chat, or could do this on the back end as well but may not be the right nove there, but could jsut incluce a little flag to hanle on the BE
    } catch (e) {
      defaultToast(TOAST_TYPE.error, 'Error adding user');
    }
  };

  // const addUserInputRef = useRef();

  // const handleKeyDown = e => {
  //   console.log('hello?');
  // };

  // useEffect(() => {
  //   if (!addUserInputRef.current) return;
  //   const keypress = new Event('keydown', {
  //     bubbles: true,
  //     cancelable: true,
  //     keycode: 32,
  //     which: 32,
  //   });
  //   addUserInputRef.current.focus();
  //   addUserInputRef.current.dispatchEvent(keypress);
  // }, [showAddUserDropdown]);

  return (
    <div className="add-user-dropdown-container">
      <div className="add-user-dropdown-tip bottom">
        <div className="add-user-dropdown-content-container">
          <input
            type="search"
            placeholder="Search users..."
            onChange={handleTextChange}
          />
          <div className="add-user-dropdown-results-container">
            {userSearchResults.map((searchResult, i) => (
              <Fragment key={i}>
                <SearchResult
                  type={SEARCH_RESULT_TYPE.addUserToExistingChat}
                  // handleAddUser={handleAddUser}
                  searchResult={searchResult}
                />
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddUserDropdown;
