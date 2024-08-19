import React from 'react';
import { FaRegEnvelopeOpen } from 'react-icons/fa';

const NotificationsButton: React.FC = () => {
  return (
    <a
      href="#"
      className="ml-5 flex-shrink-0 p-1 text-white "
    >
      <span className="sr-only">View notifications</span>
      <FaRegEnvelopeOpen className="h-8 w-8" aria-hidden="true" />
    </a>
  );
};

export default NotificationsButton;