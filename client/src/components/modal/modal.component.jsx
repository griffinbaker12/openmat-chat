import SidebarModal from '../sidebar-modal/sidebar-modal.components';
import { MODAL_TYPE, useSidebar } from '../../contexts/sidebar-context';
import ChatInfoModal from '../chat-info-modal/chat-info-modal.components';
import { useConversations } from '../../contexts/conversations-context';

// This is what I am going to think about tonight, how to make it so that the modal can either be to add friends and start chats, or to view other people's accounts

const Modal = () => {
  const { modalType } = useSidebar();
  const { activeChat } = useConversations();

  return modalType === MODAL_TYPE.sidebar ? (
    <SidebarModal />
  ) : (
    <ChatInfoModal />
  );
};

export default Modal;
