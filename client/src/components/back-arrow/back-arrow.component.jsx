import './back-arrow.styles.scss';

const BackArrow = ({ arrowType }) => {
  return (
    <>
      {arrowType === 'body' ? (
        <button
          style={{ height: '40px', width: '40px' }}
          className="back-arrow-container"
        >
          <svg viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
            ></path>
          </svg>
        </button>
      ) : (
        <button className="back-arrow-container">
          <svg viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
            ></path>
          </svg>
        </button>
      )}
    </>
  );
};
export default BackArrow;
