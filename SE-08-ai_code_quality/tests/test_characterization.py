#!/usr/bin/python3
"""Characterization tests for the legacy library catalog behavior."""

import datetime
import unittest

from legacy import Library


class TestLegacyLibraryCharacterization(unittest.TestCase):
    """Pin the current behavior of the legacy Library class."""

    def test_add_book_stores_original_book_dictionary(self):
        """Test add_book appends the current raw book dictionary shape."""
        library = Library()
        library.add_book("Clean Code", "Robert Martin", 3)
        self.assertEqual(
            library.b,
            [{"title": "Clean Code", "author": "Robert Martin", "copies": 3}]
        )

    def test_add_member_uses_incrementing_integer_ids(self):
        """Test add_member stores names with one-based integer ids."""
        library = Library()
        library.add_member("Alice")
        library.add_member("Bob")
        self.assertEqual(
            library.m,
            [{"name": "Alice", "id": 1}, {"name": "Bob", "id": 2}]
        )

    def test_search_by_title_is_currently_case_sensitive(self):
        """Test search_by_title preserves the current case-sensitive quirk."""
        library = Library()
        library.add_book("Python Tricks", "Dan Bader", 2)
        self.assertEqual(library.search_by_title("Python"), [library.b[0]])
        self.assertEqual(library.search_by_title("python"), [])

    def test_search_by_author_is_currently_case_sensitive(self):
        """Test search_by_author preserves the current case-sensitive quirk."""
        library = Library()
        library.add_book("Python Tricks", "Dan Bader", 2)
        self.assertEqual(library.search_by_author("Dan"), [library.b[0]])
        self.assertEqual(library.search_by_author("dan"), [])

    def test_duplicate_titles_returns_each_duplicate_title_once(self):
        """Test duplicate_titles returns duplicated titles without repeats."""
        library = Library()
        library.add_book("Dune", "Frank Herbert", 2)
        library.add_book("Dune", "Frank Herbert", 1)
        library.add_book("Kindred", "Octavia Butler", 4)
        library.add_book("Dune", "Another Author", 3)
        self.assertEqual(library.duplicate_titles(), ["Dune"])

    def test_duplicate_titles_returns_empty_list_without_duplicates(self):
        """Test duplicate_titles returns an empty list for unique titles."""
        library = Library()
        library.add_book("Dune", "Frank Herbert", 2)
        library.add_book("Kindred", "Octavia Butler", 4)
        self.assertEqual(library.duplicate_titles(), [])

    def test_loan_reduces_copies_and_sets_due_date(self):
        """Test successful loan reduces copies and records a due date."""
        library = Library()
        library.add_book("Dune", "Frank Herbert", 2)
        result = library.loan(1, "Dune")
        expected_due = datetime.date.today() + datetime.timedelta(days=14)
        self.assertTrue(result)
        self.assertEqual(library.b[0]["copies"], 1)
        self.assertEqual(
            library.l,
            [{"member": 1, "title": "Dune", "due": expected_due}]
        )

    def test_loan_returns_false_when_no_copies_are_available(self):
        """Test loan returns False when the matching title has no copies."""
        library = Library()
        library.add_book("Dune", "Frank Herbert", 0)
        self.assertFalse(library.loan(1, "Dune"))
        self.assertEqual(library.l, [])

    def test_loan_uses_last_matching_title_when_titles_duplicate(self):
        """Test loan currently checks the last matching duplicate title."""
        library = Library()
        library.add_book("Dune", "Frank Herbert", 5)
        library.add_book("Dune", "Another Author", 0)
        self.assertFalse(library.loan(1, "Dune"))
        self.assertEqual(library.b[0]["copies"], 5)
        self.assertEqual(library.b[1]["copies"], 0)

    def test_overdue_returns_only_loans_strictly_before_today(self):
        """Test overdue excludes loans due today and in the future."""
        library = Library()
        yesterday = datetime.date.today() - datetime.timedelta(days=1)
        today = datetime.date.today()
        tomorrow = datetime.date.today() + datetime.timedelta(days=1)
        old_loan = {"member": 1, "title": "Dune", "due": yesterday}
        today_loan = {"member": 2, "title": "Kindred", "due": today}
        future_loan = {"member": 3, "title": "Sula", "due": tomorrow}
        library.l.extend([old_loan, today_loan, future_loan])
        self.assertEqual(library.overdue(), [old_loan])

    def test_report_lists_books_and_total_copies(self):
        """Test report returns the current line format and total copies."""
        library = Library()
        library.add_book("Dune", "Frank Herbert", 2)
        library.add_book("Kindred", "Octavia Butler", 4)
        self.assertEqual(
            library.report(),
            "Dune by Frank Herbert: 2\n"
            "Kindred by Octavia Butler: 4\n"
            "TOTAL COPIES: 6\n"
        )


if __name__ == "__main__":
    unittest.main()
