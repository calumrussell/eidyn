import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event';
import { jest, expect } from '@jest/globals';

import { HorizontalBinarySelector } from "@Lib/components";

describe('HorizontalBinarySelector', () => {
  it('calls callback correctly when clicked', async () => {
    const callback = jest.fn((sel: number) => ({}))
    render(<HorizontalBinarySelector titleOne='test' titleTwo='test1' selected={1} selectFunc={callback} />)

    await userEvent.click(screen.getByTestId('titleTwo'));
    expect(callback).toHaveBeenCalledWith(1);

    await userEvent.click(screen.getByTestId('titleOne'));
    expect(callback).toHaveBeenCalledWith(0);

    //Double click should be handled within the callback
    await userEvent.click(screen.getByTestId('titleOne'));
    expect(callback).toHaveBeenCalledWith(0);

    expect(callback).toHaveBeenCalledTimes(3);
  })
  it('errors with invalid input', () => {
  })
  it('toggles selected attr when passed new selected state', () => {
  })
})