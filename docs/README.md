# Documentation index

Start at [the repository README](../README.md). AI assistants and developers should read [AGENTS.md](../AGENTS.md).

## Active documents

| Document | Question it answers |
| --- | --- |
| [WEB_APP_SPEC.md](WEB_APP_SPEC.md) | What must the product do? |
| [PROGRESS.md](PROGRESS.md) | What is actually completed and what comes next? |
| [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) | In what order do we build and verify it? |
| [PROJECT_HANDOFF.md](PROJECT_HANDOFF.md) | How can a new person or chat continue? |
| [DESIGN_REFERENCE.md](DESIGN_REFERENCE.md) | Which styles/screens should implementation follow? |
| [PRINT_PREVIEW_SPEC.md](PRINT_PREVIEW_SPEC.md) | How should orders/invoices be rendered? |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | How were services and access prepared? |
| [design/README.md](design/README.md) | Where are original design files and images? |
| [history/README.md](history/README.md) | Where is superseded planning preserved? |

## Authority and maintenance

Product rules live in WEB_APP_SPEC.md. Status lives in PROGRESS.md. The implementation plan maps work to those requirements without creating new commercial policies. Figma is the visual source, subject to the documented paper-reference override for order/invoice output.

The root README includes a complete generated specification copy. Regenerate it with python3 scripts/sync_readme.py from repository root whenever the canonical specification changes.

Historical files preserve research and old errors; they are not current instructions. Do not scan the archive first and restart an Android implementation.

Use screen IDs S01–S29, decision IDs D01–D19 and acceptance IDs A01–A34 in work items. When adding requirements, retain existing IDs and add new ones rather than renumbering historical references.
