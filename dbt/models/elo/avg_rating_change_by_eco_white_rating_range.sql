{{ 
    config(
        materialized='table',
        indexes = [
            {'columns': ['opening_id','white_rating_range'], 'unique': True},
        ],
        post_hook = "alter table avg_rating_change_by_eco_white_rating_range alter column opening_id set not null; alter table avg_rating_change_by_eco_white_rating_range alter column white_rating_range set not null;",
    ) 
}}
with data as (
    select 
    avg(white_elo_change) as avg_white_elo_change,
    count(white_elo_change)::integer as game_count,
    eco as opening_id,
    white_rating_range
    from matches
    left join {{ ref('eco_codes') }} using (eco)
    group by eco, white_rating_range, name
    order by white_rating_range asc 
)
/*Join the eco name and moves onto the result*/
select
*
from data
left join eco_names on data.opening_id = eco_names.eco
where opening_id != '' and opening_id != '?'
