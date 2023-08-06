"use client"
import React, { useState } from "react";
import styled from "styled-components";

import { HorizontalBinarySelector } from "@Lib/components";
import { eco_codes, openings, top_eco_by_black_rating_range, top_eco_by_white_rating_range, top_lichess_by_black_rating_range, top_lichess_by_white_rating_range } from "@prisma/client";
import Link from "next/link";
import { formatNumber, roundNumber } from "@Lib/functions";

const OpeningWrapper = styled.div`
  height: 500px;
  overflow-y: scroll;
`

interface OpeningGroupSelectorProps {
  eco_codes: Array<eco_codes>,
  lichess_openings: Array<openings>,
}

export const OpeningGroupSelector = ({eco_codes, lichess_openings}: OpeningGroupSelectorProps) => {
  const [selected, setSelected] = useState(0);

  const selectFunc = (pos: number) => {
    if (pos != selected) {
      setSelected(pos);
    }
  }

  return (
    <>
      <HorizontalBinarySelector
        titleOne='LiChess'
        titleTwo='ECO'
        selectFunc={selectFunc}
        selected={selected} />
      { selected === 0 || (
        <div>
          <h2>Eco Openings</h2>
          <OpeningWrapper>
            {
              eco_codes.map(code => {
                const link = `/eco/${code.eco}`;
                return (
                  <div key={code.eco}>
                    <Link href={link}>{code.eco} - {code.name}</Link>
                  </div>
                )
              })
            }
          </OpeningWrapper>
        </div>
      )} 
      { selected === 1 || (
          <div>
            <h2>Lichess Openings</h2>
            <OpeningWrapper>
              {
                lichess_openings.map(opening => {
                  const link = `/lichess/${opening.id}`
                  return (
                    <div key={opening.id}>
                      <Link href={link}>{opening.name}</Link>
                    </div>
                  )
                })
              }
            </OpeningWrapper>
          </div>
        )
      }
    </>
  )
}

interface TopOpeningsProps {
  eco_data: Array<top_eco_by_black_rating_range | top_eco_by_white_rating_range>,
  lichess_data: Array<top_lichess_by_black_rating_range | top_lichess_by_white_rating_range>,
  white: boolean
}

export const TopOpenings = ({ eco_data, lichess_data, white }: TopOpeningsProps) => {
  const [minGames, setMinGames] = useState(10000);
  const [ratingRange, setRatingRange] = useState(2);
  //0=ECO, 1=Lichess
  const [dataSource, setDataSource] = useState(0);
  const groups = ['<1000', '1000-1500', '1500-2000', '2000+'];
  const dataSources = ['ECO', 'Lichess'];

  const switchRatingRange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    setRatingRange(Number(ev.target.value));
  };

  const switchMinGames = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setMinGames(Number(ev.target.value));
  };

  const switchDataSource = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    if (Number(ev.target.value) != dataSource) {
      setDataSource(Number(ev.target.value))
    }
  };

  const data = dataSource === 0 ? eco_data: lichess_data;

  return (
    <div>
      {
        white?
        <h4>Top Openings for White</h4>:
        <h4>Top Openings for Black</h4>
      }
      {/*Weird issue with form and the scrollbar on table so this just clears the top*/}
      <form style={{marginBottom: '1rem'}}>
        <fieldset>
          <p>
            <label htmlFor="form-select-rating-range">Select Rating Range:</label>
            <select id="form-select-rating-range" onChange={switchRatingRange} value={ratingRange}>
              {
                groups.map((g, i) => <option key={i} value={i}>{g}</option>)
              }
            </select>
          </p>
          <p>
            <label htmlFor="form-select-datasource">Select Data:</label>
            <select id="form-select-datasource" onChange={switchDataSource} value={dataSource}>
              {
                [0,1].map((g, i) => <option key={i} value={i}>{dataSources[g]}</option>)
              }
            </select>
          </p>
          <p>
            <label htmlFor="form-input-min-games">Minimum Games Filter:</label>
            <input id="form-input-min-games" value={minGames} type="number" min={0} max={100000} step={10000} onChange={switchMinGames} />
          </p>
        </fieldset>
      </form>
      <div style={{height: '600px', overflowY: "scroll"}}>
        <table>
          <thead>
            <tr>
              <th>Opening</th>
              <th>Elo Gained</th>
              <th>Games Played</th>
            </tr>
          </thead>
          <tbody>
          {
            data.map((d,i) => {
              const name = "eco" in d ? d.eco : d.name ? d.name.length < 30 ? d.name : `${d.name.substring(0, 30)}...` : '';
              const link = "eco" in d ? `/eco/${d.eco}` : `/lichess/${d.opening}`;

              if (d.game_count && d.game_count > minGames) {
                if ("avg_white_elo_change" in d) {
                  if (d.white_rating_range === ratingRange) {
                   return (
                      <tr key={i} data-testid="data-row">
                        <td><Link href={link}>{name}</Link></td>
                        <td>{roundNumber(d.avg_white_elo_change ? d.avg_white_elo_change : 0.0)}</td>
                        <td>{formatNumber(d.game_count)}</td>
                      </tr>
                    )
                  }
                }
                if ("avg_black_elo_change" in d) {
                  if (d.black_rating_range === ratingRange) {
                    return (
                      <tr key={i} data-testid="data-row">
                        <td><Link href={link}>{name}</Link></td>
                        <td>{roundNumber(d.avg_black_elo_change ? d.avg_black_elo_change : 0.0)}</td>
                        <td>{formatNumber(d.game_count)}</td>
                      </tr>
                    )
                  }
                }
              }
            })
          }
          </tbody>
        </table>
      </div>
    </div>
  )
}
