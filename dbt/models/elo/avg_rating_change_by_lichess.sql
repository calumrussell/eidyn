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
    avg(black_elo_change) as avg_black_elo_change,
    count(white_elo_change)::integer as game_count,
    opening as opening_id,
    name
    from matches
    left join {{ ref('win_probs') }} using(hash)
    left join {{ ref('rating_change') }} using(hash)
    left join openings on matches.opening=openings.id
    group by opening, name
    order by avg_white_elo_change desc
