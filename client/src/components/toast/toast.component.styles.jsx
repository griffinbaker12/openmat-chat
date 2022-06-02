import { useState, forwardRef, useImperativeHandle } from 'react';
import './toast.styles.scss';

export const TOAST_TYPE = {
  success: 'success',
  failure: 'failure',
};

const Toast = forwardRef((props, ref) => {
  const { message, type } = props;
  const [isToastShowing, setIsToastShowing] = useState(false);

  useImperativeHandle(ref, () => ({
    show() {
      setIsToastShowing(true);
      setTimeout(() => isToastShowing(false), 3000);
    },
  }));

  return (
    <div
      id={isToastShowing ? 'show' : 'hide'}
      className={`toast-container ${type}`}
    >
      <div className="toast-symbol-container">
        {type === TOAST_TYPE.success ? (
          <div className="toast-success-symbol">&#x2713;</div>
        ) : (
          <div className="toast-failure-symbol">&#10006;</div>
        )}
      </div>
      <div className="toast-text-container">{message}</div>
    </div>
  );
});

export default Toast;
