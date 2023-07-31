{{ 
    config(
        materialized='table',
        indexes = [
            {'columns': ['eco'], 'unique': True},
        ],
        post_hook = "alter table avg_rating_change_by_eco alter column eco set not null",
    ) 
}}
select 
    avg(white_elo_change) as avg_white_elo_change,
    avg(black_elo_change) as avg_black_elo_change,
    count(white_elo_change)::integer as game_count,
    eco
    from matches
    left join {{ ref('win_probs') }} using(hash)
    left join {{ ref('rating_change') }} using(hash)
    group by eco
    order by avg_white_elo_change desc
