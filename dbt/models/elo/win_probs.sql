{{ 
    config(
        materialized='table',
        indexes = [
            {'columns': ['hash'], 'unique': True},
        ],
        post_hook = "alter table win_probs alter column hash set not null",
    ) 
}}
select
    1/(1+power(10, ((black_elo::real-white_elo::real)/400))) as white_exp, 
    1/(1+power(10, ((white_elo::real-black_elo::real)/400))) as black_exp, 
    res,
    hash
    from matches
