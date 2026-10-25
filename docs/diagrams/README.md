# NearAid diagrams

Design diagrams for NearAid, matching the current implementation (React client, Express API, PostgreSQL + PostGIS with a Haversine read-only SAMPLE fallback).

| # | Diagram | Image | Editable source |
|---|---------|-------|-----------------|
| 1 | DFD Level 0 - context | [png](images/1-dfd-level-0-context.png) | [dot](sources/dfd-level-0-context.dot) |
| 2 | DFD Level 1 | [png](images/2-dfd-level-1.png) | [dot](sources/dfd-level-1.dot) |
| 3 | DFD Level 2 - Search Nearby Facilities | [png](images/3-dfd-level-2-search.png) | [dot](sources/dfd-level-2-search.dot) |
| 4 | Use case | [png](images/4-use-case.png) | [puml](sources/use-case.puml) |
| 5 | Conceptual class diagram | [png](images/5-class-conceptual.png) | [puml](sources/class-conceptual.puml) |
| 6 | Sequence - find nearby facilities | [png](images/6-sequence-find-nearby.png) | [puml](sources/sequence-find-nearby.puml) |

## How these were made

These images are rendered with **PlantUML** (use case, class, sequence) and **Graphviz** (DFDs) from the text sources in `sources/`. They were **not** drawn in Sparx Enterprise Architect. Native Sparx versions are being prepared separately and will be added to this folder when they exist.

To re-render:

```bash
java -jar plantuml.jar -tpng sources/*.puml
dot -Tpng -Gdpi=160 sources/dfd-level-1.dot -o dfd-level-1.png
```

## Notes
- The class diagram is conceptual: the backend is plain JavaScript modules and functions, not ES classes.
- Facility data in the demo is SAMPLE data. Call links are disabled for SAMPLE placeholder numbers.
