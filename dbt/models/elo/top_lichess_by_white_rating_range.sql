{{ 
    config(
        materialized='table',
        indexes = [
        {'columns': ['opening_id', 'white_rating_range'], 'unique': True},
        ],
        post_hook = "alter table top_lichess_by_white_rating_range alter column opening_id set not null; alter table top_lichess_by_white_rating_range alter column white_rating_range set not null;",
    ) 
}}

select 
    avg_white_elo_change,
    opening_id,
    white_rating_range,
    game_count,
    name,
    rank() over (
        partition by white_rating_range
        order by avg_white_elo_change desc
    ) as rank
    from {{ ref('avg_rating_change_by_lichess_white_rating_range') }} 