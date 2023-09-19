{{ 
    config(
        materialized='table',
        indexes = [
            {'columns': ['opening_id','black_rating_range'], 'unique': True},
        ],
        post_hook = "alter table avg_rating_change_by_lichess_black_rating_range alter column opening_id set not null; alter table avg_rating_change_by_lichess_black_rating_range alter column black_rating_range set not null;",
    ) 
}}
select 
    avg(matches.white_elo_change * -1) as avg_black_elo_change,
    count(matches.white_elo_change)::integer as game_count,
    opening as opening_id,
    name,
    black_rating_range
    from matches
    left join openings on openings.id=matches.opening
    where name != '?'
    group by opening, name, black_rating_range
    order by black_rating_range asc 
