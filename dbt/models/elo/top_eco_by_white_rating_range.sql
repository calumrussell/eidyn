{{ 
    config(
        materialized='table',
        indexes = [
            {'columns': ['eco', 'white_rating_range'], 'unique': True},
        ],
        post_hook = "alter table top_eco_by_white_rating_range alter column eco set not null; alter table top_eco_by_white_rating_range alter column white_rating_range set not null;",
    ) 
}}

select 
    avg_white_elo_change,
    eco,
    white_rating_range,
    game_count,
    name,
    rank() over (
        partition by white_rating_range
        order by avg_white_elo_change desc
    ) as rank
    from {{ ref('avg_rating_change_by_eco_white_rating_range') }} 