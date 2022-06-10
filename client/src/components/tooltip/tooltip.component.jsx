import { useState } from 'react';
import './tooltip.styles.scss';

const Tooltip = props => {
  const [active, setActive] = useState(false);

  const showTip = () => setActive(true);

  const hideTip = () => setActive(false);

  return (
    <div
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
      className="tooltip-container"
    >
      {props.children}
      {active && (
        <div className={`tooltip-tip ${props.direction || 'top'}`}>
          {props.content}
        </div>
      )}
    </div>
  );
};
export default Tooltip;
