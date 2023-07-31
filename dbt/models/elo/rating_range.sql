{{ 
    config(
        materialized='table',
        indexes = [
            {'columns': ['hash'], 'unique': True},
        ],
        post_hook = "alter table rating_range alter column hash set not null",
    ) 
}}
select 
    case when black_elo < 1000 then 0 when black_elo between 1000 and 1500 then 1 when black_elo between 1500 and 2000 then 2 else 3 end black_rating_range,
    case when white_elo < 1000 then 0 when white_elo between 1000 and 1500 then 1 when white_elo between 1500 and 2000 then 2 else 3 end white_rating_range,
    hash
    from matches
