import { createIcon } from '@chakra-ui/icons';
import React from 'react';

export const ClockIcon = createIcon({
  displayName: 'ClockIcon',
  viewBox: '0 0 24 24',
  path: (
    <>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 20.8C16.8601 20.8 20.8 16.8601 20.8 12C20.8 7.13991 16.8601 3.20001 12 3.20001C7.13991 3.20001 3.20001 7.13991 3.20001 12C3.20001 16.8601 7.13991 20.8 12 20.8ZM12 22.8C17.9647 22.8 22.8 17.9647 22.8 12C22.8 6.03534 17.9647 1.20001 12 1.20001C6.03534 1.20001 1.20001 6.03534 1.20001 12C1.20001 17.9647 6.03534 22.8 12 22.8Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 6.20001C12.5523 6.20001 13 6.64773 13 7.20001V11H15.6C16.1523 11 16.6 11.4477 16.6 12C16.6 12.5523 16.1523 13 15.6 13H11V7.20001C11 6.64773 11.4477 6.20001 12 6.20001Z"
        fill="currentColor"
      />
    </>
  ),
});
