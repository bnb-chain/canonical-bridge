import { createIcon } from '@chakra-ui/icons';
import React from 'react';

export const ExpandIcon = createIcon({
  displayName: 'ExpandIcon',
  viewBox: '0 0 24 24',
  path: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19 12.3636C18.4477 12.3636 18 11.9159 18 11.3636V7.41422L7.41421 18H11.3636C11.9159 18 12.3636 18.4477 12.3636 19C12.3636 19.5523 11.9159 20 11.3636 20H5H4V19V12.6364C4 12.0841 4.44772 11.6364 5 11.6364C5.55228 11.6364 6 12.0841 6 12.6364V16.5858L16.5858 6L12.6364 6C12.0841 6 11.6364 5.55229 11.6364 5C11.6364 4.44772 12.0841 4 12.6364 4L19 4L20 4V5L20 11.3636C20 11.9159 19.5523 12.3636 19 12.3636Z"
      fill="currentColor"
    />
  ),
});
