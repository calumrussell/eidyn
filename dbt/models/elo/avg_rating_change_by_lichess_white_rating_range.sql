{{ 
    config(
        materialized='table',
        indexes = [
            {'columns': ['opening','white_rating_range'], 'unique': True},
        ],
        post_hook = "alter table avg_rating_change_by_lichess_white_rating_range alter column opening set not null; alter table avg_rating_change_by_lichess_white_rating_range alter column white_rating_range set not null;",
    ) 
}}
select 
    avg(white_elo_change) as avg_white_elo_change,
    count(white_elo_change)::integer as game_count,
    opening,
    name,
    white_rating_range
    from matches
    left join {{ ref('win_probs') }} using(hash)
    left join {{ ref('rating_change') }} using(hash)
    left join {{ ref('rating_range') }} using(hash)
    left join openings on openings.id=matches.opening
    group by opening, name, white_rating_range
    order by white_rating_range asc 
