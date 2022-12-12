# react-tag

Base tag components that support React and React native

## Installation

> yarn add @bearei/react-tag --save

## Parameters

| Name | Type | Required | Description |
| :-- | --: | --: | :-- |
| icon | `ReactNode` | ✘ | Tag icon |
| closeIcon | `ReactNode` | ✘ | Tag close button icon |
| color | `string` | ✘ | Tag color |
| border | `boolean` | ✘ | Whether or not to display the tag border |
| closeIconVisible | `boolean` | ✘ | Whether the tag close button icon is visible |
| disabled | `boolean` | ✘ | Whether or not to disable the Tag |
| loading | `boolean` | ✘ | Whether the tag is loading |
| text | `string` | ✘ | Tag to display text |
| size | `small` `medium` `large` | ✘ | Tag size |
| shape | `square` `circle` `round` | ✘ | Tag shape |
| onClose | `(options: TagOptions) => void` | ✘ | This function is called when the tag is closed |
| onClick | `(e: React.MouseEvent) => void` | ✘ | This function is called when tag is clicked |
| onTouchEnd | `(e: React.TouchEvent) => void` | ✘ | This function is called when the tag is pressed |
| onPress | `(e: GestureResponderEvent) => void` | ✘ | This function is called when the tag is pressed -- react native |
| renderIcon | `(props: TagIconProps) => ReactNode` | ✘ | Render the tag icon |
| renderCloseIcon | `(props: TagCloseIconProps) => ReactNode` | ✘ | Render the tag close icon |
| renderMain | `(props: TagMainProps) => ReactNode` | ✔ | Render the tag main |
| renderContainer | `(props: TagContainerProps) => ReactNode` | ✔ | Render the tag container |

## Use

```typescript
import React from 'React';
import ReactDOM from 'react-dom';
import Tag from '@bearei/react-tag';

const tag = (
  <Tag
    text="tag"
    icon={<i>"icon"</i>}
    closeIcon={<i>"closeIcon"</i>}
    renderIcon={({children}) => <i>{children}</i>}
    renderCloseIcon={({children}) => <i>{children}</i>}
    renderMain={({text, ...props}) => <span {...props}>{text}</span>}
    renderContainer={({id, children}) => (
      <div data-id={id} tabIndex={1}>
        {children}
      </div>
    )}
  />
);

ReactDOM.render(tag, container);
```
