import psycopg2
import sys
import os
import datetime
import time as sys_time

def reverse(values):
    flip = {}
    for value in values:
        flip[value[1]] = value[0]
    return flip

if __name__ == "__main__":
    pg_port = os.getenv("PG_PORT")
    pg_pwd = os.getenv("PG_PWD")
    pg_user = os.getenv("PG_USER")
    pg_host = os.getenv("PG_HOST")
    db_name = os.getenv("PG_DB")
    chunk = sys.argv[1]
    count = 0
    query = ""

    conn = psycopg2.connect(
        dbname=db_name, user=pg_user, password=pg_pwd, host=pg_host, port=pg_port)

    cur = conn.cursor()

    cur.execute("select * from ending")
    ending = reverse(cur.fetchall())
    cur.execute("select * from event")
    event = reverse(cur.fetchall())
    cur.execute("select * from openings")
    opening = reverse(cur.fetchall())
    cur.execute("select * from time")
    time = reverse(cur.fetchall())

    for row in sys.stdin:
        groups = row.strip().split("||")
        if not groups or groups[0] == "":
            break

        game_ending = groups[4]
        game_event = groups[7]
        game_opening = groups[2]
        game_time = groups[3]

        if game_ending not in ending:
            cur.execute(f"insert into ending(name) values('{game_ending}') returning id;")
            conn.commit()
            game_ending_id = cur.fetchone()[0]
            ending[game_ending] = game_ending_id
        else:
            game_ending_id = ending[game_ending]

        if game_event not in event:
            cur.execute(f"insert into event(name) values('{game_event}') returning id;")
            conn.commit()
            game_event_id = cur.fetchone()[0]
            event[game_event] = game_event_id
        else:
            game_event_id = event[game_event]

        if game_opening not in opening:
            replaced = game_opening.replace("'", "''")
            cur.execute(f"insert into openings(name) values('{replaced}') returning id;")
            conn.commit()
            game_opening_id = cur.fetchone()[0]
            opening[game_opening] = game_opening_id
        else:
            game_opening_id = opening[game_opening]

        if game_time not in time:
            cur.execute(f"insert into time(name) values('{game_time}') returning id;")
            conn.commit()
            game_time_id = cur.fetchone()[0]
            time[game_time] = game_time_id
        else:
            game_time_id = time[game_time]

        white_elo = groups[0]
        black_elo = groups[1]
        eco = groups[8]
        last_move = groups[9]
        result = groups[6] 
        hash = groups[10]
        prob = groups[11]
        white_win = groups[12]
        if result == "1-0":
            result = b"10"
        elif result == "0-1":
            result = b"01"
        else:
            result = b"00"

        raw_date = groups[5]
        if raw_date == "":
            date = -1
        else:
            date = int(datetime.datetime.strptime(raw_date, "%Y.%m.%d").timestamp())

        if count == 0:
            query = f"""insert into matches(
                black_elo,
                white_elo,
                opening,
                time,
                ending,
                date,
                event,
                eco,
                last_move,
                res,
                hash,
                prob,
                win)
                values
                """
            count+=1
        elif count > int(chunk):
            chop_comma = query[:-1]
            chop_comma += " on conflict do nothing;"
            cur.execute(chop_comma)
            conn.commit()
            print(f"Written {chunk} rows {sys_time.time()}")
            count = 0
        else:
            query+= f"""(
                {black_elo},
                {white_elo},
                {game_opening_id},
                {game_time_id},
                {game_ending_id},
                {date},
                {game_event_id},
                '{eco}',
                {last_move},
                {result},
                '{hash}',
                {prob},
                {True if white_win == 1 else False}
                ),"""
            count+=1
