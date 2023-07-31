{{ 
    config(
        materialized='table',
        indexes = [
            {'columns': ['eco','black_rating_range'], 'unique': True},
        ],
        post_hook = "alter table avg_rating_change_by_eco_black_rating_range alter column eco set not null; alter table avg_rating_change_by_eco_black_rating_range alter column black_rating_range set not null;",
    ) 
}}
with data as (
    select 
    avg(black_elo_change) as avg_black_elo_change,
    count(black_elo_change)::integer as game_count,
    eco,
    black_rating_range
    from matches
    left join {{ ref('win_probs') }} using(hash)
    left join {{ ref('rating_change') }} using(hash)
    left join {{ ref('rating_range') }} using(hash)
    left join {{ ref('eco_codes') }} using (eco)
    group by eco, black_rating_range
    order by black_rating_range asc 
)
/*Join the eco name and moves onto the result*/
select
*
from data
left join eco_names using(eco)
where eco != '' and eco != '?'
