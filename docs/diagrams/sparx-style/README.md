# NearAid diagrams - Sparx-style set

Data flow diagrams (levels 0, 1, 2) and four UML diagrams (use case, class, sequence, deployment).

**Tool note:** these are drawn in the visual style of Sparx Enterprise Architect (pale yellow elements, black outlines, Arial). They were **not made in Sparx Enterprise Architect**. They were made with PlantUML and Graphviz. The editable text sources are in [8-editable-sources.zip](8-editable-sources.zip).

| # | Diagram | Image |
|---|---------|-------|
| 1 | DFD Level 0 - context | [png](1-dfd-level-0-sparx-style.png) |
| 2 | DFD Level 1 | [png](2-dfd-level-1-sparx-style.png) |
| 3 | DFD Level 2 - Search Nearby Facilities | [png](3-dfd-level-2-sparx-style.png) |
| 4 | UML use case | [png](4-use-case-sparx-style.png) |
| 5 | UML class (conceptual) | [png](5-class-sparx-style.png) |
| 6 | UML sequence - find nearby facilities | [png](6-sequence-find-nearby-sparx-style.png) |
| 7 | UML deployment (Vercel, Render, hosted PostgreSQL + PostGIS) | [png](7-deployment-sparx-style.png) |

To re-render: `java -jar plantuml.jar -tpng *.puml` and `dot -Tpng -Gdpi=160 <file>.dot -o <file>.png` on the files inside the zip.

The earlier diagrams in the parent folder (diagrams.net and PlantUML) are kept unchanged.
