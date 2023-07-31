import sys

if __name__ == "__main__":
    counter = 0
    buf = []
    for row in sys.stdin:
        if counter == 20:
            print("||".join(buf))
            counter = 0
            buf = []
        else:
            buf.append(row.strip())
            counter +=1
