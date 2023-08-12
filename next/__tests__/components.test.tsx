import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event';
import { jest, expect } from '@jest/globals';

import { HorizontalBinarySelector } from "@Lib/components";
import { eco_codes, openings, top_eco_by_white_rating_range, top_lichess_by_white_rating_range } from '@prisma/client';
import { OpeningGroupSelector, TopOpenings } from '@Lib/containers';

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
})

const fakeEcoCodes: Array<eco_codes> = [
  {
    eco: "A01",
    name: "Flying Cat",
  },
  {
    eco: "A02",
    name: "Flying Kite",
  },
  {
    eco: "A03",
    name: "Flying Fiction",
  }
];

const fakeLichess: Array<openings> = [
  {
    id: 0,
    name: "Bad choice",
  },
  {
    id: 1,
    name: "Good choice",
  },
  {
    id: 2,
    name: "No choice",
  }
];

describe('OpeningGroupSelector', () => {
  it('renders default 0th selection correctly', async () => {
    render(<OpeningGroupSelector eco_codes={fakeEcoCodes} lichess_openings={fakeLichess} />);
    //Default choice is Lichess
    expect(screen.getByText('Bad choice')).toBeInTheDocument();
  });

  it('switches selection when clicked', async () => {
    render(<OpeningGroupSelector eco_codes={fakeEcoCodes} lichess_openings={fakeLichess} />);
    //Default choice is Lichess
    expect(screen.getByText('Lichess Openings')).toBeInTheDocument();

    //Depends on HorizontalBinarySelector
    expect(screen.getByTestId('titleTwo')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('titleTwo'));

    expect(screen.queryByText('Lichess Openings')).not.toBeInTheDocument();
    expect(screen.getByText('Eco Openings')).toBeInTheDocument();
  })
})

//These tests only focus on the filter conditions used in TopOpenings which are:
// *Rating range
// *Game count
// *Data Source (i.e. eco or lichess openings)
const fakeEcoData: Array<top_eco_by_white_rating_range> = [
  {
    avg_white_elo_change: 1,
    opening_id: 'A01',
    white_rating_range: 0,
    game_count: 20000,
    name: 'Fake Opening',
    rank: BigInt(1),
  },
  {
    avg_white_elo_change: 1,
    opening_id: 'A02',
    white_rating_range: 1,
    game_count: 50,
    name: 'Fake Opening',
    rank: BigInt(1),
  },
  {
    avg_white_elo_change: 1,
    opening_id: 'A02',
    white_rating_range: 2,
    game_count: 10,
    name: 'Fake Opening',
    rank: BigInt(1),
  },
  {
    avg_white_elo_change: 1,
    opening_id: 'A02',
    white_rating_range: 2,
    game_count: 10001,
    name: 'Fake Opening',
    rank: BigInt(1),
  },
  {
    avg_white_elo_change: 1,
    opening_id: 'A03',
    white_rating_range: 2,
    game_count: 10000,
    name: 'Fake Opening',
    rank: BigInt(1),
  },
];

const fakeLichessData: Array<top_lichess_by_white_rating_range> = [
  {
    avg_white_elo_change: 1,
    opening_id: 10,
    white_rating_range: 0,
    game_count: 100000,
    name: 'Fake Opening',
    rank: BigInt(1),
  },
  {
    avg_white_elo_change: 1,
    opening_id: 11,
    white_rating_range: 3,
    game_count: 100000,
    name: 'Fake Opening',
    rank: BigInt(1),
  },
  {
    avg_white_elo_change: 1,
    opening_id: 12,
    white_rating_range: 2,
    game_count: 100000,
    name: 'Fake Opening',
    rank: BigInt(1),
  },
  {
    avg_white_elo_change: 1,
    opening_id: 13,
    white_rating_range: 2,
    game_count: 100000,
    name: 'Fake Opening',
    rank: BigInt(1),
  },
]

describe('TopOpeningProps', () => {
  it('renders default elo range correctly', async () => {
    render(<TopOpenings eco_data={fakeEcoData} lichess_data={fakeLichessData} white={true} />);

    //Default setting is min 10k games, rating group=2, and eco data source
    expect((await screen.findAllByTestId('data-row'))).toHaveLength(1);
  });

  it('filters on data source', async () => {
    render(<TopOpenings eco_data={fakeEcoData} lichess_data={fakeLichessData} white={true} />);

    await fireEvent.change(await screen.findByTestId('form-select-datasource'), { target: { value: 1 }});
    expect((await screen.findAllByTestId('data-row'))).toHaveLength(2);
  });

  it('filters on rating range', async () => {
    render(<TopOpenings eco_data={fakeEcoData} lichess_data={fakeLichessData} white={true} />);

    await fireEvent.change(await screen.findByTestId('form-select-rating-range'), { target: { value: 2 }});
    expect((await screen.findAllByTestId('data-row'))).toHaveLength(1);
  });

  it('filters on number of games', async () => {
    render(<TopOpenings eco_data={fakeEcoData} lichess_data={fakeLichessData} white={true} />);

    await fireEvent.change(await screen.findByTestId('form-input-min-games'), { target: { value: 1 }});
    expect((await screen.findAllByTestId('data-row'))).toHaveLength(3);
  });
})
