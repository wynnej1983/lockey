import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';

import Lock from './';

describe('Lock component', () => {
  test('renders lock', async () => {
    const {getByText} = render(
      <Lock id={1} name={'Front door'} status={'unlocked'} houseId={1} />,
    );

    const name = getByText('Front door');
    const status = getByText('unlocked');

    expect(name).toBeTruthy();
    expect(status).toBeTruthy();
  });

  test('updates status when lock pressed', async () => {
    const onChangeStatusMock = jest.fn();
    const {getByText} = render(
      <Lock
        id={1}
        name={'Front door'}
        status={'unlocked'}
        onChangeStatus={onChangeStatusMock}
      />,
    );

    fireEvent(getByText('Front door'), 'onLongPress');
    const status = await waitFor(() => getByText('locking'));

    expect(onChangeStatusMock).toHaveBeenCalled();
    expect(status).toBeTruthy();
  });

  test('updates status when lock released', async () => {
    const onChangeStatusMock = jest.fn();
    const {getByText} = render(
      <Lock
        id={1}
        name={'Front door'}
        status={'unlocked'}
        onChangeStatus={onChangeStatusMock}
      />,
    );

    fireEvent(getByText('Front door'), 'onPressOut');
    const status = await waitFor(() => getByText('unlocked'));
    expect(status).toBeTruthy();
  });
});
