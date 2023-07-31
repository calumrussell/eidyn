{{ 
    config(
        materialized='table',
        indexes = [
            {'columns': ['hash'], 'unique': True},
        ],
        post_hook = "alter table rating_change alter column hash set not null",
    ) 
}}
select 
    case when res='10' then 32*(1-white_exp) when res='00' then 32*(0.5-white_exp) else 32*(-white_exp) end as white_elo_change,
    case when res='01' then 32*(1-black_exp) when res='00' then 32*(0.5-black_exp) else 32*(-black_exp) end as black_elo_change,
    hash
    from {{ ref('win_probs') }}
