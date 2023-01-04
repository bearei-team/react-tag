import {
  bindEvents,
  handleDefaultEvent,
} from '@bearei/react-util/lib/commonjs/event';
import {
  DetailedHTMLProps,
  HTMLAttributes,
  MouseEvent,
  ReactNode,
  Ref,
  TouchEvent,
  useId,
} from 'react';
import type {
  GestureResponderEvent,
  TouchableHighlightProps,
} from 'react-native';

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
export interface BaseTagProps<T>
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
  onClick?: (e: MouseEvent<T>) => void;

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
  renderIcon?: (props: TagIconProps<T>) => ReactNode;

  /**
   * Render the tag close icon
   */
  renderCloseIcon?: (props: TagCloseIconProps<T>) => ReactNode;

  /**
   * Render the tag main
   */
  renderMain: (props: TagMainProps<T>) => ReactNode;

  /**
   * Render the tag container
   */
  renderContainer: (props: TagContainerProps<T>) => ReactNode;
}

/**
 * Tag children props
 */
export interface TagChildrenProps<T> extends Omit<BaseTagProps<T>, 'ref'> {
  /**
   * Component unique ID
   */
  id: string;
  children?: ReactNode;
}

export type TagIconProps<T> = TagChildrenProps<T>;
export type TagCloseIconProps<T> = TagIconProps<T>;
export type TagMainProps<T> = TagChildrenProps<T> &
  Pick<BaseTagProps<T>, 'ref'>;

export type TagContainerProps<T> = TagChildrenProps<T>;

export interface HandleResponseOptions<E> {
  isClose?: boolean;
  callback?: (e: E) => void;
}

export type EventType = 'onClick' | 'onPress' | 'onTouchEnd';

const Tag = <T extends HTMLElement = HTMLElement>(props: TagProps<T>) => {
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
  const bindEvenNames = ['onClick', 'onPress', 'onTouchEnd'];
  const eventNames = Object.keys(props).filter(key =>
    bindEvenNames.includes(key),
  ) as EventType[];

  const childrenProps = { ...args, loading, disabled, id };
  const handleTagOptionsChange = <E,>(options: TagOptions<E>) => {
    onClose?.(options);
  };

  const handleResponse = <E,>(
    e: E,
    { isClose, callback }: HandleResponseOptions<E>,
  ) => {
    const isResponse = !loading && !disabled;

    if (isResponse) {
      isClose && handleTagOptionsChange({ event: e });
      callback?.(e);
    }
  };

  const handleCallback = (isClose?: boolean) => (event: EventType) => {
    const options = { isClose };
    const eventFunctions = {
      onClick: handleDefaultEvent((e: MouseEvent<T>) =>
        handleResponse(e, { ...options, callback: onClick }),
      ),
      onTouchEnd: handleDefaultEvent((e: TouchEvent<T>) =>
        handleResponse(e, { ...options, callback: onTouchEnd }),
      ),
      onPress: handleDefaultEvent((e: GestureResponderEvent) =>
        handleResponse(e, { ...options, callback: onPress }),
      ),
    };

    return eventFunctions[event];
  };

  const iconNode = icon && renderIcon?.({ ...childrenProps, children: icon });
  const closeIconNode =
    closeIcon &&
    renderCloseIcon?.({
      ...childrenProps,
      children: closeIcon,
      ...(bindEvents(eventNames, handleCallback(true)) as {
        onClick?: (e: MouseEvent<T>) => void;
        onTouchEnd?: (e: TouchEvent<T>) => void;
        onPress?: (e: GestureResponderEvent) => void;
      }),
    });

  const main = renderMain({
    ...childrenProps,
    ref,
    loading,
    disabled,
    icon: iconNode,
    closeIcon: closeIconNode,
    ...(bindEvents(eventNames, handleCallback()) as {
      onClick?: (e: MouseEvent<T>) => void;
      onTouchEnd?: (e: TouchEvent<T>) => void;
      onPress?: (e: GestureResponderEvent) => void;
    }),
  });

  const container = renderContainer({ ...childrenProps, children: main });

  return <>{container}</>;
};

export default Tag;
