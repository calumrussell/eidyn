{{ 
    config(
        materialized='table',
        indexes = [
            {'columns': ['eco','white_rating_range'], 'unique': True},
        ],
        post_hook = "alter table avg_rating_change_by_eco_white_rating_range alter column eco set not null; alter table avg_rating_change_by_eco_white_rating_range alter column white_rating_range set not null;",
    ) 
}}
with data as (
    select 
    avg(white_elo_change) as avg_white_elo_change,
    count(white_elo_change)::integer as game_count,
    eco,
    white_rating_range
    from matches
    left join {{ ref('win_probs') }} using(hash)
    left join {{ ref('rating_change') }} using(hash)
    left join {{ ref('rating_range') }} using(hash)
    left join {{ ref('eco_codes') }} using (eco)
    group by eco, white_rating_range
    order by white_rating_range asc 
)
/*Join the eco name and moves onto the result*/
select
*
from data
left join eco_names using(eco)
where eco != '' and eco != '?'
