import Link from 'next/link';
import React from 'react';
import { FaRegEnvelopeOpen } from 'react-icons/fa';

const NotificationsButton: React.FC = () => {
  return (
    <Link
      href="#"
      className="ml-5 flex-shrink-0 p-1 text-white "
    >
      <span className="sr-only">View notifications</span>
      <FaRegEnvelopeOpen className="h-8 w-8" aria-hidden="true" />
    </Link>
  );
};

export default NotificationsButton;