import prisma from '@Lib/prisma';
import React from 'react';
import { OpeningGroupSelector, TopOpenings } from '@Lib/containers';

async function getEcoCodes() {
  const eco_codes = await prisma.eco_codes.findMany({});
  return eco_codes;
}

async function getTopEcoOpeningsWhiteByRatingRange() {
  const top_eco_white_by_rating_range = await prisma.top_eco_by_white_rating_range.findMany({});
  return top_eco_white_by_rating_range;
}

async function getTopEcoOpeningsBlackByRatingRange() {
  const top_eco_black_by_rating_range = await prisma.top_eco_by_black_rating_range.findMany({});
  return top_eco_black_by_rating_range;
}

async function getTopLichessOpeningsWhiteByRatingRange() {
  const top_lichess_white_by_rating_range = await prisma.top_lichess_by_white_rating_range.findMany({});
  return top_lichess_white_by_rating_range;
}

async function getTopLichessOpeningsBlackByRatingRange() {
  const top_lichess_black_by_rating_range = await prisma.top_lichess_by_black_rating_range.findMany({});
  return top_lichess_black_by_rating_range;
}

async function getLichessOpenings() {
  const lichess_codes = await prisma.openings.findMany({
    where: {
      name: {
        not: '?'
      }
    },
    orderBy: {
      name: 'asc'
    }
  });
  return lichess_codes;
}

export default async function Page() {
  const [eco_codes, lichess_openings, top_eco_white_by_rating_range, top_eco_black_by_rating_range, top_lichess_by_white_rating_range, top_lichess_by_black_rating_range] = await Promise.all([getEcoCodes(), getLichessOpenings(), getTopEcoOpeningsWhiteByRatingRange(), getTopEcoOpeningsBlackByRatingRange(), getTopLichessOpeningsWhiteByRatingRange(), getTopLichessOpeningsBlackByRatingRange()])
  return (
    <main>
      <OpeningGroupSelector 
        eco_codes={eco_codes}
        lichess_openings={lichess_openings} />
      <TopOpenings
        white={true}
        lichess_data={top_lichess_by_white_rating_range}
        eco_data={top_eco_white_by_rating_range} />
      <TopOpenings
        white={false}
        lichess_data={top_lichess_by_black_rating_range}
        eco_data={top_eco_black_by_rating_range} />
    </main>
  )
}