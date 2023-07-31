{{ 
    config(
        materialized='table',
        indexes = [
            {'columns': ['eco'], 'unique': True},
        ],
        post_hook = "alter table eco_codes alter column eco set not null",
    ) 
}}

select
    distinct(eco) as eco,
    name
    from matches
    left join eco_names using(eco)
    where eco != '' and eco != '?'