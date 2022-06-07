import UserInfoModal from '../user-info-modal/user-info-modal.components';
import SidebarModal from '../sidebar-modal/sidebar-modal.components';
import { useSidebar } from '../../contexts/sidebar-context';

// This is what I am going to think about tonight, how to make it so that the modal can either be to add friends and start chats, or to view other people's accounts

const Modal = ({ closeModal }) => {
  // OLD
  // const { showModal, sideBarCategory, modalType } = useSidebar();

  // Only need the modal type and show modal type; maybe I don't need show modal.., only in the actual modal themselves
  const { modalType } = useSidebar();

  console.log(modalType);

  return modalType === 'sidebar' ? <SidebarModal /> : <UserInfoModal />;
};

export default Modal;
