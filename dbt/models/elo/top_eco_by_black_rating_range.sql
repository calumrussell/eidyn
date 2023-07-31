{{ 
    config(
        materialized='table',
        indexes = [
            {'columns': ['eco', 'black_rating_range'], 'unique': True},
        ],
        post_hook = "alter table top_eco_by_black_rating_range alter column eco set not null; alter table top_eco_by_black_rating_range alter column black_rating_range set not null",
    ) 
}}

select 
    avg_black_elo_change,
    eco,
    black_rating_range,
    game_count,
    name,
    rank() over (
        partition by black_rating_range
        order by avg_black_elo_change desc
    ) as rank
    from {{ ref('avg_rating_change_by_eco_black_rating_range') }} 