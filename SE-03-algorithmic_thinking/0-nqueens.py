#!/usr/bin/python3
"""Solve the N queens puzzle using backtracking."""
import sys


def is_safe(queens, row, col):
    """Return True if a queen can be placed at row, col."""
    for queen_row, queen_col in queens:
        if queen_col == col:
            return False
        if abs(queen_row - row) == abs(queen_col - col):
            return False
    return True


def solve_nqueens(n, row=0, queens=None):
    """Print all valid N queens solutions."""
    if queens is None:
        queens = []

    if row == n:
        print(queens)
        return

    for col in range(n):
        if is_safe(queens, row, col):
            solve_nqueens(n, row + 1, queens + [[row, col]])


def validate_args(args):
    """Validate command line arguments and return N."""
    if len(args) != 2:
        print("Usage: nqueens N")
        sys.exit(1)

    try:
        n = int(args[1])
    except ValueError:
        print("N must be a number")
        sys.exit(1)

    if n < 4:
        print("N must be at least 4")
        sys.exit(1)

    return n


if __name__ == "__main__":
    solve_nqueens(validate_args(sys.argv))
