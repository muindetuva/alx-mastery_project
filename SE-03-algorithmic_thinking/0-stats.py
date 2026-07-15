#!/usr/bin/python3
"""Read HTTP access logs from stdin and print running metrics."""
import sys


VALID_STATUS_CODES = (200, 301, 400, 401, 403, 404, 405, 500)


def parse_line(line):
    """Return status code and file size from a valid log line."""
    parts = line.split()

    if len(parts) != 9:
        return None

    if parts[1] != "-" or parts[4] != '"GET':
        return None

    if parts[5] != "/projects/260" or parts[6] != 'HTTP/1.1"':
        return None

    try:
        status_code = int(parts[7])
        file_size = int(parts[8])
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
    except KeyboardInterrupt:
        print_stats(total_size, status_counts)
        raise

    print_stats(total_size, status_counts)


if __name__ == "__main__":
    main()
