import { pickHTMLAttributes } from '@bearei/react-util';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Tag from '../../src/components/Tag';
import { render } from '../utils/test-utils';

describe('test/components/Tag.test.ts', () => {
  test('It should be a render tag', async () => {
    const { getByDataCy } = render(
      <Tag
        content="tag"
        icon={<i>"icon"</i>}
        closeIcon={<i>"closeIcon"</i>}
        renderIcon={({ children }) => <i data-cy="icon">{children}</i>}
        renderCloseIcon={({ children, ...props }) => (
          <i data-cy="closeIcon" {...pickHTMLAttributes(props)}>
            {children}
          </i>
        )}
        renderMain={({ content, icon, closeIcon, ...props }) => (
          <i {...pickHTMLAttributes(props)} data-cy="tag">
            {icon}
            {content}
            {closeIcon}
          </i>
        )}
        renderContainer={({ id, children }) => (
          <div data-cy="container" data-id={id} tabIndex={1}>
            {children}
          </div>
        )}
      />,
    );

    expect(getByDataCy('container')).toHaveAttribute('tabIndex');
    expect(getByDataCy('tag')).toHaveTextContent('tag');
    expect(getByDataCy('icon')).toHaveTextContent('icon');
    expect(getByDataCy('closeIcon')).toHaveTextContent('closeIcon');
  });

  test('It should be a tag click', async () => {
    const user = userEvent.setup();
    let eventType!: string | undefined;

    const { getByDataCy } = render(
      <Tag
        onClick={e => (eventType = e?.type)}
        closeIcon={<i>"closeIcon"</i>}
        renderCloseIcon={({ children, ...props }) => (
          <i {...pickHTMLAttributes(props)} data-cy="closeIcon">
            {children}
          </i>
        )}
        renderMain={({ content, icon, closeIcon, ...props }) => (
          <i {...pickHTMLAttributes(props)} data-cy="tag">
            {icon}
            {content}
            {closeIcon}
          </i>
        )}
        renderContainer={({ children }) => (
          <div data-cy="container">{children}</div>
        )}
      />,
    );

    await user.click(getByDataCy('container'));
    await user.click(getByDataCy('closeIcon'));
    expect(eventType).toEqual('click');
  });

  test('It should be a disabled tag', async () => {
    const user = userEvent.setup();
    let eventType!: string | undefined;

    const { getByDataCy } = render(
      <Tag
        onClick={e => (eventType = e?.type)}
        disabled
        renderMain={({ content, icon, closeIcon, ...props }) => (
          <i {...pickHTMLAttributes(props)} data-cy="tag">
            {icon}
            {content}
            {closeIcon}
          </i>
        )}
        renderContainer={({ children }) => (
          <div data-cy="container">{children}</div>
        )}
      />,
    );

    await user.click(getByDataCy('tag'));
    expect(eventType).toEqual(undefined);
  });

  test('It should be the tag loading', async () => {
    const user = userEvent.setup();
    let eventType!: string | undefined;

    const { getByDataCy } = render(
      <Tag
        onClick={e => (eventType = e?.type)}
        loading
        renderMain={({ content, icon, closeIcon, ...props }) => (
          <i {...pickHTMLAttributes(props)} data-cy="tag">
            {icon}
            {content}
            {closeIcon}
          </i>
        )}
        renderContainer={({ children }) => (
          <div data-cy="container">{children}</div>
        )}
      />,
    );

    await user.click(getByDataCy('tag'));
    expect(eventType).toEqual(undefined);
  });
});
