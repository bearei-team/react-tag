import {bindEvents, handleDefaultEvent} from '@bearei/react-util/lib/event';
import {DetailedHTMLProps, HTMLAttributes, ReactNode, Ref, TouchEvent, useId} from 'react';
import type {GestureResponderEvent, TouchableHighlightProps} from 'react-native';

/**
 * Tag options
 */
export interface TagOptions<E = unknown> {
  /**
   * Triggers an event when a tag option changes
   */
  event?: E;
}

/**
 * Base tag props
 */
export interface BaseTagProps<T = HTMLElement>
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<T>, T> & TouchableHighlightProps,
    'onClick' | 'onTouchEnd' | 'onPress'
  > {
  /**
   * Custom ref
   */
  ref?: Ref<T>;

  /**
   * Tag icon
   */
  icon?: ReactNode;

  /**
   * Tag color
   */
  color?: string;

  /**
   * Whether or not to display the label border
   */
  border?: boolean;

  /**
   * Whether the tag close button icon is visible
   */
  closeIconVisible?: boolean;

  /**
   * Tag close button icon
   */
  closeIcon?: ReactNode;

  /**
   *  Whether or not to disable the tag
   */
  disabled?: boolean;

  /**
   * Whether the tag is loading
   */
  loading?: boolean;

  /**
   * Tag to display text
   */
  text?: string;

  /**
   * Tag size
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Tag shape
   */
  shape?: 'square' | 'circle' | 'round';

  /**
   * This function is called when the tag is closed
   */
  onClose?: <E>(options: TagOptions<E>) => void;

  /**
   * This function is called when tag is clicked
   */
  onClick?: (e: React.MouseEvent<T, MouseEvent>) => void;

  /**
   * This function is called when the tag is pressed
   */
  onTouchEnd?: (e: TouchEvent<T>) => void;

  /**
   * This function is called when the tag is pressed -- react native
   */
  onPress?: (e: GestureResponderEvent) => void;
}

/**
 * Tag props
 */
export interface TagProps<T> extends BaseTagProps<T> {
  /**
   * Render the tag icon
   */
  renderIcon?: (props: TagIconProps) => ReactNode;

  /**
   * Render the tag close icon
   */
  renderCloseIcon?: (props: TagCloseIconProps) => ReactNode;

  /**
   * Render the tag main
   */
  renderMain: (props: TagMainProps<T>) => ReactNode;

  /**
   * Render the tag container
   */
  renderContainer: (props: TagContainerProps) => ReactNode;
}

/**
 * Tag children props
 */
export interface TagChildrenProps extends Omit<BaseTagProps, 'ref'> {
  /**
   * Component unique ID
   */
  id: string;
  children?: ReactNode;
}

export type TagIconProps = TagChildrenProps;
export type TagCloseIconProps = TagIconProps;
export type TagMainProps<T> = TagChildrenProps & Pick<BaseTagProps<T>, 'ref'>;
export type TagContainerProps = TagChildrenProps;

export interface HandleResponseOptions<E> {
  isClose?: boolean;
  callback?: (e: E) => void;
}

const Tag = <T extends HTMLElement>(props: TagProps<T>) => {
  const {
    ref,
    icon,
    loading,
    disabled,
    closeIcon,
    onClick,
    onPress,
    onClose,
    onTouchEnd,
    renderIcon,
    renderCloseIcon,
    renderMain,
    renderContainer,
    ...args
  } = props;

  const id = useId();
  const events = Object.keys(props).filter(key => key.startsWith('on'));
  const childrenProps = {...args, loading, disabled, id};

  const handleTagOptionsChange = <E,>(options: TagOptions<E>) => {
    onClose?.(options);
  };

  const handleResponse = <E,>(e: E, {isClose, callback}: HandleResponseOptions<E>) => {
    const isResponse = !loading && !disabled;

    if (isResponse) {
      isClose && handleTagOptionsChange({event: e});
      callback?.(e);
    }
  };

  const handleCallback = (isClose?: boolean) => (key: string) => {
    const options = {isClose};
    const event = {
      onClick: handleDefaultEvent((e: React.MouseEvent<T, MouseEvent>) =>
        handleResponse(e, {...options, callback: onClick}),
      ),
      onTouchEnd: handleDefaultEvent((e: TouchEvent<T>) =>
        handleResponse(e, {...options, callback: onTouchEnd}),
      ),
      onPress: handleDefaultEvent((e: GestureResponderEvent) =>
        handleResponse(e, {...options, callback: onPress}),
      ),
    };

    return event[key as keyof typeof event];
  };

  const iconNode = icon && renderIcon?.({...childrenProps, children: icon});
  const closeIconNode =
    closeIcon &&
    renderCloseIcon?.({
      ...childrenProps,
      children: closeIcon,
      ...bindEvents(events, handleCallback(true)),
    });

  const main = renderMain({
    ...childrenProps,
    ref,
    loading,
    disabled,
    icon: iconNode,
    closeIcon: closeIconNode,
    ...bindEvents(events, handleCallback()),
  });

  const container = renderContainer({
    ...childrenProps,
    children: main,
  });

  return <>{container}</>;
};

export default Tag;
