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
    //Tedious but this component really doesn't work at all without two choices and other options
    // @ts-ignore
    render(<HorizontalBinarySelector titleOne='test' titleTwo='test1' selected={1} />);
    expect(screen.queryByTestId('titleOne')).not.toBeInTheDocument();

    // @ts-ignore
    render(<HorizontalBinarySelector titleOne='test' titleTwo='test1' selectFunc={(sel) => {}} />);
    expect(screen.queryByTestId('titleOne')).not.toBeInTheDocument();

    // @ts-ignore
    render(<HorizontalBinarySelector titleOne='test' selected={0} selectFunc={(sel) => {}} />);
    expect(screen.queryByTestId('titleOne')).not.toBeInTheDocument();
    
    // @ts-ignore
    render(<HorizontalBinarySelector titleTwo='test1' selected={0} selectFunc={(sel) => {}} />);
    expect(screen.queryByTestId('titleOne')).not.toBeInTheDocument();
  })
})