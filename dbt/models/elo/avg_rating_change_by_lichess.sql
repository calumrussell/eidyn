{{ 
    config(
        materialized='table',
        indexes = [
            {'columns': ['opening'], 'unique': True},
        ],
        post_hook = "alter table avg_rating_change_by_lichess alter column opening set not null",
    ) 
}}
select 
    avg(white_elo_change) as avg_white_elo_change,
    avg(black_elo_change) as avg_black_elo_change,
    count(white_elo_change)::integer as game_count,
    opening
    from matches
    left join {{ ref('win_probs') }} using(hash)
    left join {{ ref('rating_change') }} using(hash)
    group by opening
    order by avg_white_elo_change desc
