# CSS Grid Layout

> **Prerequisites:** HTML Structure, CSS Box Model
> **Topic:** Two-Dimensional Layout Systems

While Flexbox is designed for one-dimensional layout (rows **OR** columns), CSS Grid is the first CSS module created specifically to solve the layout problems we've been hacking together for years. It excels at dividing a page into major regions in **two dimensions** (rows **AND** columns) simultaneously.

---

## 🏗️ Part 1: The Grid Terminology

To speak "Grid," you need to understand the invisible lines that act as the scaffolding for your content.



### 1.1 The Core Components

| Term | Definition | Visual Analogy |
| :--- | :--- | :--- |
| **Grid Container** | The parent element with `display: grid`. | The Spreadsheet file. |
| **Grid Item** | Direct children of the container. | The data inside the spreadsheet. |
| **Grid Line** | The dividing lines (horizontal & vertical). | The borders between Excel cells. |
| **Grid Track** | The space between two lines. | A generic term for a column or a row. |
| **Grid Cell** | The smallest unit on the grid. | A single cell (e.g., A1). |
| **Grid Area** | A rectangular group of adjacent cells. | A selection of multiple cells merged together. |

---

## 📐 Part 2: Defining the Grid

Unlike Flexbox, where you mostly define behavior on the children, Grid requires you to define the structure on the **Parent Container** first.

### 2.1 The `fr` Unit (Fraction)
Grid introduces a new unit: `fr`. This represents a "fraction of the available free space." It calculates automatically, saving you from doing math with percentages (e.g., `33.333%`).

```css
.container {
  display: grid;
  /* Create 3 columns: 
     1. Fixed 200px
     2. Takes 1 part of free space
     3. Takes 2 parts of free space (twice as big as col 2) 
  */
  grid-template-columns: 200px 1fr 2fr;
  
  /* Create 2 rows: fixed height and auto height */
  grid-template-rows: 100px auto;
  
  /* Create gaps (gutters) between items */
  gap: 20px;
}