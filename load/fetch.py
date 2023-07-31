import sys
import wget


if __name__ == "__main__":
    month = sys.argv[1]
    year = sys.argv[2]

    base = "https://database.lichess.org/standard/"
    path = f"lichess_db_standard_rated_{year}-{month}.pgn.zst"
    filename = wget.download(base+path)
