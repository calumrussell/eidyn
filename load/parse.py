import re
import sys

def parse_lines(lines):
    black_elo = 0
    white_elo = 0
    opening = ""
    time_control = ""
    termination = ""
    utc_date = ""
    result = ""
    event = ""
    eco = ""
    last_move = 0
    hash = ""
    for row in lines:
        if row[:5] == "[Site":
            site_url = re.findall(r'"(.*?)"', row)[0]
            hash = site_url.split("/")[-1]
        if row[:9] == "[WhiteElo":
            elo_group = re.search(r'"(.*?)"', row).groups()
            if elo_group:
                white_elo = elo_group[0]
        if row[:9] == "[BlackElo":
            elo_group = re.search(r'"(.*?)"', row).groups()
            if elo_group:
                black_elo = elo_group[0]
        if row[:8] == "[Opening":
            opening = re.findall(r'"(.*?)"', row)[0]
        if row[:9] == "[TimeCont":
            time_control = re.findall(r'"(.*?)"', row)[0]
        if row[:9] == "[Terminat":
            termination = re.findall(r'"(.*?)"', row)[0]
        if row[:5] == "[Date":
            utc_date = re.findall(r'"(.*?)"', row)[0]
        if row[:6] == "[Event":
            event = re.findall(r'"(.*?)"', row)[0]
            if 'https' in event:
                event = " ".join(event.split(" ")[:-1])
        if row[:4] == "[ECO":
            eco = re.findall(r'"(.*?)"', row)[0]
        if row[:3] == "1. ":
            last_move = re.findall(r'(\d+\.)', row)[-1].strip(".")
    return f"{white_elo}||{black_elo}||{opening}||{time_control}||{termination}||{utc_date}||{result}||{event}||{eco}||{last_move}||{hash}||"

if __name__ == "__main__":
    for line in sys.stdin:
        rows = line.split("||")
        res = parse_lines(rows)
        print(res)
