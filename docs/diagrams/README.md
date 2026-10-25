# NearAid diagrams

Design diagrams for NearAid, matching the current implementation (React client, Express API, PostgreSQL + PostGIS with a read-only SAMPLE fallback using Haversine).

## Editable diagrams (diagrams.net)

Made in [diagrams.net](https://app.diagrams.net) (draw.io). Open a `.drawio` file with **File > Open from > Device** (no account needed) to edit it, and export PNG or SVG from **File > Export as**.

| # | Diagram | Image | Editable file |
|---|---------|-------|---------------|
| 1 | DFD Level 0 - context | [png](drawio/1-dfd-level-0-context.png) | [drawio](drawio/1-dfd-level-0-context.drawio) |
| 2 | DFD Level 1 | [png](drawio/2-dfd-level-1.png) | [drawio](drawio/2-dfd-level-1.drawio) |
| 3 | DFD Level 2 - Search Nearby Facilities | [png](drawio/3-dfd-level-2-search.png) | [drawio](drawio/3-dfd-level-2-search.drawio) |
| 4 | Use case | [png](drawio/4-use-case.png) | [drawio](drawio/4-use-case.drawio) |
| 5 | Conceptual class diagram | [png](drawio/5-class-conceptual.png) | [drawio](drawio/5-class-conceptual.drawio) |
| 6 | Sequence - find nearby facilities | [png](drawio/6-sequence-find-nearby.png) | [drawio](drawio/6-sequence-find-nearby.drawio) |

## Text-based versions (PlantUML and Graphviz)

The same six diagrams, rendered from text sources.

| # | Diagram | Image | Source |
|---|---------|-------|--------|
| 1 | DFD Level 0 - context | [png](images/1-dfd-level-0-context.png) | [dot](sources/dfd-level-0-context.dot) |
| 2 | DFD Level 1 | [png](images/2-dfd-level-1.png) | [dot](sources/dfd-level-1.dot) |
| 3 | DFD Level 2 - Search Nearby Facilities | [png](images/3-dfd-level-2-search.png) | [dot](sources/dfd-level-2-search.dot) |
| 4 | Use case | [png](images/4-use-case.png) | [puml](sources/use-case.puml) |
| 5 | Conceptual class diagram | [png](images/5-class-conceptual.png) | [puml](sources/class-conceptual.puml) |
| 6 | Sequence - find nearby facilities | [png](images/6-sequence-find-nearby.png) | [puml](sources/sequence-find-nearby.puml) |

To re-render:

```bash
java -jar plantuml.jar -tpng sources/*.puml
dot -Tpng -Gdpi=160 sources/dfd-level-1.dot -o dfd-level-1.png
```

## Tools

None of these were made in Sparx Enterprise Architect. They were made with diagrams.net (editable files) and PlantUML/Graphviz (text-based versions).

## Notes
- The class diagram is conceptual: the backend is plain JavaScript modules and functions, not ES classes.
- Location comes from the device GPS (after tapping "Find help near me") or from coordinates entered manually. The sequence diagrams show the GPS case.
- Category filtering is optional; the default is all categories.
- Facility data in the demo is SAMPLE data. Call links are disabled for SAMPLE placeholder numbers.
