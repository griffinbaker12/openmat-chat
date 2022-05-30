import './authentication.styles.scss';

const Authentication = () => {
  return (
    <div className="authenticaition-container">
      <div className="authentication-form-container">
        <form className="authentication-form">
          <label>
            Username
            <input type="text" />
          </label>
        </form>
      </div>
    </div>
  );
};

export default Authentication;
