import { Button, ButtonProps } from '@node-real/uikit';

export const BnbChainButton = (props: ButtonProps) => {
  const { title, value, onChange, children, ...restProps } = props;
  return (
    <Button
      background="button.primary.default"
      color={'text.on.color.primary'}
      _hover={{
        background: 'button.primary.hover',
      }}
      _disabled={{
        background: 'button.disabled',
        cursor: 'not-allowed',
        _hover: { background: 'button.disabled' },
      }}
      type="submit"
      {...restProps}
    >
      {children}
    </Button>
  );
};
