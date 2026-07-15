#!/usr/bin/python3
"""Legacy library catalog. Works, but rough. Improve it.

Intended spec the improved version must satisfy:
  * Catalog search is meant to be CASE-INSENSITIVE.
  * A loan reduces a title's copies by 1 and is due in 14 days.
  * overdue() returns loans whose due date is strictly before today.
"""
import datetime


class Library:
    def __init__(self):
        self.b = []   # books
        self.m = []   # members
        self.l = []   # loans

    def add_book(self, title, author, copies):
        self.b.append({"title": title, "author": author, "copies": copies})

    def add_member(self, name):
        self.m.append({"name": name, "id": len(self.m) + 1})

    def search_by_title(self, q):
        res = []
        for x in self.b:
            if q in x["title"]:          # case-sensitive: the latent bug
                res.append(x)
        return res

    def search_by_author(self, q):
        res = []
        for x in self.b:
            if q in x["author"]:         # copy-paste of search_by_title
                res.append(x)
        return res

    def duplicate_titles(self):
        dups = []
        for i in range(len(self.b)):
            for j in range(len(self.b)):          # O(n^2) hot path
                if i != j and self.b[i]["title"] == self.b[j]["title"]:
                    if self.b[i]["title"] not in dups:
                        dups.append(self.b[i]["title"])
        return dups

    def loan(self, member_id, title):
        found = None
        for x in self.b:
            if x["title"] == title:
                found = x
        if found and found["copies"] > 0:
            found["copies"] = found["copies"] - 1
            self.l.append({"member": member_id, "title": title,
                           "due": datetime.date.today() +
                           datetime.timedelta(days=14)})
            return True
        return False

    def overdue(self):
        today = datetime.date.today()
        out = []
        for x in self.l:
            if x["due"] < today:
                out.append(x)
        return out

    def report(self):
        s = ""
        t = 0
        for x in self.b:
            t = t + x["copies"]
            s = s + x["title"] + " by " + x["author"] + ": " \
                + str(x["copies"]) + "\n"
        s = s + "TOTAL COPIES: " + str(t) + "\n"
        return s
