#!/usr/bin/env python3
"""Refresh the README specification mirror. Standard library only."""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
BEGIN = "<!-- BEGIN WEB_APP_SPEC -->"
END = "<!-- END WEB_APP_SPEC -->"

def render_spec(text):
    def fix_link(match):
        target = match.group(1)
        if re.match(r"^(?:[a-z][a-z0-9+.-]*:|#|/)", target, re.I):
            return match.group(0)
        return "](docs/" + target + ")"
    text = re.sub(r"\]\(([^)\n]+)\)", fix_link, text)
    text = text.removeprefix("# Inventory & Sales — Authoritative Web-App Specification\n\n")
    return text.rstrip() + "\n"

def main():
    if sys.argv[1:] not in ([], ["--check"]):
        raise SystemExit("Usage: python3 scripts/sync_readme.py [--check]")
    path = ROOT / "README.md"
    readme = path.read_text(encoding="utf-8")
    if readme.count(BEGIN) != 1 or readme.count(END) != 1:
        raise SystemExit("README must contain exactly one specification marker pair.")
    before, rest = readme.split(BEGIN, 1)
    _, after = rest.split(END, 1)
    spec = (ROOT / "docs/WEB_APP_SPEC.md").read_text(encoding="utf-8")
    updated = before + BEGIN + "\n" + render_spec(spec) + END + after
    if "--check" in sys.argv:
        if readme != updated:
            raise SystemExit("README mirror is stale. Run python3 scripts/sync_readme.py")
        print("README specification mirror is current.")
    else:
        path.write_text(updated, encoding="utf-8")
        print("README specification mirror refreshed.")

if __name__ == "__main__":
    main()
