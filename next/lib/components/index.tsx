"use client"

import React from "react";
import styled from "styled-components";

interface HorizontalBinarySelectorProps {
  titleOne: string,
  titleTwo: string,
  selected: number,
  selectFunc: (selected: number) => void,
}

export const HorizontalBinarySelectorWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`

interface HorizontalBinarySelectorBoxProps {
  selected: boolean,
}

export const HorizontalBinarySelectorBox = styled.div<HorizontalBinarySelectorBoxProps>`
  flex-basis: 50%;
  border: 1px solid var(--off-background-color);
  width:100%;
  height: 2rem;
  text-align: center;
  line-height: 2rem;
  background-color: ${({ selected }: HorizontalBinarySelectorBoxProps) => selected ? 'var(--off-background-color)': 'transparent' };
`

export const HorizontalBinarySelector = ({titleOne, titleTwo, selected, selectFunc}: HorizontalBinarySelectorProps) => {
  const onClickBox = (ev: React.MouseEvent<HTMLDivElement>, pos: number) => {
    selectFunc(pos);
  }

  return (
    <div style={{width: '100%'}}>
      <HorizontalBinarySelectorWrapper>
        <HorizontalBinarySelectorBox data-testid="titleOne" onClick={(ev => onClickBox(ev, 0))} selected={selected === 0}>{titleOne}</HorizontalBinarySelectorBox>
        <HorizontalBinarySelectorBox data-testid="titleTwo" onClick={(ev => onClickBox(ev, 1))} selected={selected === 1}>{titleTwo}</HorizontalBinarySelectorBox>
      </HorizontalBinarySelectorWrapper>
    </div>
  )
}

export type RatingRange = 0 | 1 | 2 | 3;