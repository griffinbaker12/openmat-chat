import './spinner.styles.scss';

const Spinner = ({ type }) => {
  return (
    <>
      {type === 'search' ? (
        <div className="search-spinner-container">
          <div className="spinner-container"></div>
        </div>
      ) : (
        <div className="spinner-container"></div>
      )}
    </>
  );
};

export default Spinner;
