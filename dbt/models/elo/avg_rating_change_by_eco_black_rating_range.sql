{{ 
    config(
        materialized='table',
        indexes = [
            {'columns': ['opening_id','black_rating_range'], 'unique': True},
        ],
        post_hook = "alter table avg_rating_change_by_eco_black_rating_range alter column opening_id set not null; alter table avg_rating_change_by_eco_black_rating_range alter column black_rating_range set not null;",
    ) 
}}
with data as (
    select 
    avg(white_elo_change * -1) as avg_black_elo_change,
    count(white_elo_change)::integer as game_count,
    eco as opening_id,
    black_rating_range
    from matches
    left join {{ ref('eco_codes') }} using (eco)
    group by eco, black_rating_range, name
    order by black_rating_range asc 
)
/*Join the eco name and moves onto the result*/
select
*
from data
left join eco_names on data.opening_id = eco_names.eco
where opening_id != '' and opening_id != '?'
