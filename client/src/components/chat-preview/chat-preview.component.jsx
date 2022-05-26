import { useState } from 'react';
import './chat-preview.styles.scss';

const ChatPreview = ({ sideBarCategory }) => {
  const [activePreview, setActivePreview] = useState(null);

  // Need to create 2 components, one for the friends view and one for the convo preview view
  // Also going to need a map down below where I map over all of the data that I am pulling in and then add the class to the right; could also do a name function as well where you get the name off of the element that was clicked and then set it to the active one
  return (
    <ul className="chat-preview-list">
      <li className="chat-preview-item-active">Test</li>
      <li className="chat-preview-item">Test</li>
    </ul>
  );
};

export default ChatPreview;
