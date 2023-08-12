import React from 'react';

import prisma from '@Lib/prisma';
import { numOrZero, roundNumber, formatNumber, zip } from '@Lib/functions';
import OpeningsEloChangeBarChart from '@Lib/charts';
import { RatingRange } from '@Lib/components';
import { avg_rating_change_by_lichess_black_rating_range, avg_rating_change_by_lichess_white_rating_range } from '@prisma/client';

//Tedious but the best way to do this right now, would have to reorder schema and union averaging to solve which is overkill
const addMissingBlack = (rating_group: Array<avg_rating_change_by_lichess_black_rating_range>) => {
  const ranges = rating_group.map(g => g.black_rating_range);
  const groups = [0,1,2,3];
  const missing = groups.filter(x => !ranges.includes(x));
  if (missing.length === 0) {
    return rating_group;
  } else {
    const copy = [...rating_group];
    missing.forEach(g => {
      copy.push({
        black_rating_range: g,
        opening_id: copy[0].opening_id,
        name: copy[0].name,
        game_count: 0,
        avg_black_elo_change: 0,
      })
    });
    copy.sort((a, b) => a.black_rating_range - b.black_rating_range);
    return copy;
  }
}

const addMissingWhite = (rating_group: Array<avg_rating_change_by_lichess_white_rating_range>) => {
  const ranges = rating_group.map(g => g.white_rating_range);
  const groups = [0,1,2,3];
  const missing = groups.filter(x => !ranges.includes(x));
  if (missing.length === 0) {
    return rating_group;
  } else {
    const copy = [...rating_group];
    missing.forEach(g => {
      copy.push({
        white_rating_range: g,
        opening_id: copy[0].opening_id,
        name: copy[0].name,
        game_count: 0,
        avg_white_elo_change: 0,
      })
    });
    copy.sort((a, b) => a.white_rating_range - b.white_rating_range);
    return copy;
  }
}


async function getLichessOpening(id: number) {
  const opening = await prisma.openings.findFirst({
    where: {
      id: id
    }
  })
  return opening;
}

async function getAvgRatingChange(id: number) {
  const avg_rating_change = await prisma.avg_rating_change_by_lichess.findFirst({
    where: {
      opening_id: id 
    },
  });
  return avg_rating_change;
}

async function getAvgRatingChangeByLichessWhite(id: number) {
  const avg_rating_change_by_elo_white = await prisma.avg_rating_change_by_lichess_white_rating_range.findMany({
    where: {
      opening_id: id
    }
  });
  return avg_rating_change_by_elo_white;
}

async function getAvgRatingChangeByLichessBlack(id: number) {
  const avg_rating_change_by_elo_black = await prisma.avg_rating_change_by_lichess_black_rating_range.findMany({
    where: {
      opening_id: id
    }
  });
  return avg_rating_change_by_elo_black;
}

interface Opening {
  params: {
    opening: string
  }
}

export default async function Page(opening: Opening) {
  const lichess_id = Number(opening.params.opening);
  const [lichess, rating_change, rating_change_by_elo_white, rating_change_by_elo_black] = await Promise.all([getLichessOpening(lichess_id), getAvgRatingChange(lichess_id), getAvgRatingChangeByLichessWhite(lichess_id), getAvgRatingChangeByLichessBlack(lichess_id)])
  const opening_name = lichess ? lichess.name : "";

  if (rating_change === null || rating_change_by_elo_white === null || rating_change_by_elo_black === null) {
    return <></>
  }

  //The query that builds the table is ordered, works but obviously not robust
  const rating_change_by_elo = zip(addMissingWhite(rating_change_by_elo_white), addMissingBlack(rating_change_by_elo_black)).map(d => {
    //Because query builds ordered table, we can take range from white or black
    return {
      range: d[0].white_rating_range,
      white: d[0].avg_white_elo_change,
      black: d[1].avg_black_elo_change,
      white_count: d[0].game_count,
      black_count: d[1].game_count,
    }
  })

  const groupMap = {
    0: '<1000',
    1: '1000-1500',
    2: '1500-2000',
    3: '2000+'
  };

  const groups = ['<1000', '1000-1500', '1500-2000', '2000+'];
  const whiteChartData = rating_change_by_elo.map((elo, i) => {
    return {
      name: groups[i],
      value: numOrZero(elo.white),
    }
  })
  whiteChartData.push({
    name: 'All',
    value: rating_change.avg_white_elo_change ? rating_change.avg_white_elo_change: 0.0,
  });

  const blackChartData = rating_change_by_elo.map((elo, i) => {
    return {
      name: groups[i],
      value: numOrZero(elo.black),
    }
  })
  blackChartData.push({
    name: 'All',
    value: rating_change.avg_black_elo_change ? rating_change.avg_black_elo_change: 0.0,
  });

  return (
    <div>
      <h2>{opening_name}</h2>
      <div>
        <h4>White</h4>
        <table>
          <thead>
            <tr>
              <th>Rating Group</th>
              <th>Elo gain/loss</th>
              <th>Game count</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>All</td>
              <td>{roundNumber(numOrZero(rating_change.avg_white_elo_change))}</td>
              <td>{formatNumber(numOrZero(rating_change.game_count))}</td>
            </tr>
            {
              rating_change_by_elo_white.map((elo_group, i) => {
                return (
                  <tr key={i}>
                    <td>{groupMap[elo_group.white_rating_range as RatingRange]}</td>
                    <td>{roundNumber(numOrZero(elo_group.avg_white_elo_change))}</td>
                    <td>{formatNumber(numOrZero(elo_group.game_count))}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        <OpeningsEloChangeBarChart chartData={whiteChartData} />
      </div>
      <div>
        <h4>Black</h4>
        <table>
          <thead>
            <tr>
              <th>Rating Group</th>
              <th>Elo gain/loss</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>All</td>
              <td>{roundNumber(numOrZero(rating_change.avg_black_elo_change))}</td>
              <td>{formatNumber(numOrZero(rating_change.game_count))}</td>
            </tr>
            {
              rating_change_by_elo_black.map((elo_group, i) => {
                return (
                  <tr key={i}>
                    <td>{groupMap[elo_group.black_rating_range as RatingRange]}</td>
                    <td>{roundNumber(numOrZero(elo_group.avg_black_elo_change))}</td>
                    <td>{formatNumber(numOrZero(elo_group.game_count))}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        <OpeningsEloChangeBarChart chartData={blackChartData} />
      </div>
   </div>
  )
}

export async function generateStaticParams() {
  const openings = await prisma.openings.findMany({});
 
  return openings.map((opening) => ({
    opening: opening.id.toString(),
  }))
}