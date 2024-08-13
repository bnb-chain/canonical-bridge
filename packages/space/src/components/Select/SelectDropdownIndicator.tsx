import { CaretDownIcon, CaretUpIcon } from '@bnb-chain/icons';
import { theme } from '@chakra-ui/react';

import { CLASS_NAMES } from '../constants';

export const SelectDropdownIndicator = () => {
  return (
    <>
      <CaretDownIcon
        w={theme.sizes['4']}
        h={theme.sizes['4']}
        className={CLASS_NAMES.SELECT__DROPDOWN_ICON_DOWN}
        display="none"
      />
      <CaretUpIcon
        w={theme.sizes['4']}
        h={theme.sizes['4']}
        className={CLASS_NAMES.SELECT__DROPDOWN_ICON_UP}
        display="none"
      />
    </>
  );
};
