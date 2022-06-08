import './search-result.styles.scss';

const SearchResult = ({ searchResult, handleAddUser }) => {
  const { _id } = searchResult;

  return (
    <div name={_id} onClick={handleAddUser} className="search-result-container">
      <div className="search-result-image-container">
        <img height="100%" src={searchResult.picture} alt="profile" />
      </div>
      <div className="search-result-name">{searchResult.name}</div>
    </div>
  );
};

export default SearchResult;
