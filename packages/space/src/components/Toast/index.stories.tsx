import { StackProps, ToastId, VStack, useToast } from '@chakra-ui/react';
import { Meta } from '@storybook/react';
import { useRef } from 'react';

import { theme } from '../../modules/theme';
import { Button } from '../Button';
import { STATUSES, STATUSES_TO_COLOR_SCHEME } from '../internal/Status';

import {
  Toast,
  ToastCloseButton,
  ToastContent,
  ToastDescription,
  ToastDivider,
  ToastIcon,
  ToastLeftContent,
  ToastRightContent,
  ToastTitle,
} from '.';

export default {
  title: 'Components/Molecules/Toast',
  component: Toast,
} as Meta;

const Stack = (props: StackProps) => {
  return <VStack alignItems="start" w="min-content" spacing={theme.sizes['8']} {...props} />;
};

export const Default = () => {
  const toast = useToast();

  return (
    <Stack>
      {STATUSES.map((it) => {
        return (
          <Button
            key={it}
            colorScheme={STATUSES_TO_COLOR_SCHEME[it]}
            onClick={() =>
              toast({
                position: 'top',
                render: () => (
                  <Toast status={it} variant="bottom-accent">
                    <ToastLeftContent>
                      <ToastIcon />
                    </ToastLeftContent>
                    <ToastContent>
                      <ToastDescription>This is a description.</ToastDescription>
                    </ToastContent>
                  </Toast>
                ),
              })
            }
          >
            Show Toast
          </Button>
        );
      })}
    </Stack>
  );
};

export const WithClose = () => {
  const toast = useToast();
  const toastIdRef = useRef<ToastId>();

  return (
    <Button
      w="min-content"
      onClick={() => {
        if (toastIdRef.current) {
          return;
        }

        toastIdRef.current = toast({
          position: 'top',
          duration: 1000000,
          render: () => (
            <Toast status="info" variant="bottom-accent">
              <ToastLeftContent>
                <ToastIcon />
              </ToastLeftContent>
              <ToastContent>
                <ToastTitle>BNB Chain</ToastTitle>
                <ToastDescription>This is a description.</ToastDescription>
              </ToastContent>
              <ToastDivider />
              <ToastRightContent>
                <ToastCloseButton
                  onClick={() => {
                    if (toastIdRef.current) {
                      toast.close(toastIdRef.current);
                      toastIdRef.current = undefined;
                    }
                  }}
                />
              </ToastRightContent>
            </Toast>
          ),
        });
      }}
    >
      Show Toast
    </Button>
  );
};
