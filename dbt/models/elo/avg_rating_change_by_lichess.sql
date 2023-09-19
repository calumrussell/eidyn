{{ 
    config(
        materialized='table',
        indexes = [
            {'columns': ['opening_id'], 'unique': True},
        ],
        post_hook = "alter table avg_rating_change_by_lichess alter column opening_id set not null",
    ) 
}}
select 
    avg(white_elo_change) as avg_white_elo_change,
    avg(white_elo_change * -1) as avg_black_elo_change,
    count(white_elo_change)::integer as game_count,
    opening as opening_id,
    name
    from matches
    left join openings on matches.opening=openings.id
    where name != '?'
    group by opening, name
    order by avg_white_elo_change desc
