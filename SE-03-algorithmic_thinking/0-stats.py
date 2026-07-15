#!/usr/bin/python3
"""Read HTTP access logs from stdin and print running metrics."""
import sys


VALID_STATUS_CODES = (200, 301, 400, 401, 403, 404, 405, 500)


def parse_line(line):
    """Return status code and file size from a valid log line."""
    line = line.strip()

    first_split = line.split(" - [", 1)
    if len(first_split) != 2 or first_split[0] == "":
        return None

    second_split = first_split[1].split(
        '] "GET /projects/260 HTTP/1.1" ', 1
    )
    if len(second_split) != 2 or second_split[0] == "":
        return None

    parts = second_split[1].split()
    if len(parts) != 2:
        return None

    try:
        status_code = int(parts[0])
        file_size = int(parts[1])
    except ValueError:
        return None

    return status_code, file_size


def print_stats(total_size, status_counts):
    """Print total file size and status code counts."""
    print("File size: {}".format(total_size))
    for status_code in VALID_STATUS_CODES:
        if status_counts[status_code] > 0:
            print("{}: {}".format(status_code, status_counts[status_code]))


def main():
    """Process stdin and print metrics every 10 valid lines."""
    total_size = 0
    valid_lines = 0
    last_printed_count = -1
    status_counts = {code: 0 for code in VALID_STATUS_CODES}

    try:
        for line in sys.stdin:
            parsed = parse_line(line)
            if parsed is None:
                continue

            status_code, file_size = parsed
            total_size += file_size
            valid_lines += 1

            if status_code in status_counts:
                status_counts[status_code] += 1

            if valid_lines % 10 == 0:
                print_stats(total_size, status_counts)
                last_printed_count = valid_lines
    except KeyboardInterrupt:
        print_stats(total_size, status_counts)
        raise

    if valid_lines != last_printed_count:
        print_stats(total_size, status_counts)


if __name__ == "__main__":
    main()
