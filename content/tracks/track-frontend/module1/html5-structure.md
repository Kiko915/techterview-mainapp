# HTML5 Semantic Structure

> **Difficulty:** Beginner  
> **Topic:** Web Accessibility & SEO

Semantic HTML is the foundation of an accessible, maintainable, and SEO-friendly web application. In this lesson, we explore why using the correct tags matters more than just visual layout.

## 🎯 Learning Objectives

By the end of this lesson, you will be able to:
1.  Identify the core semantic tags in HTML5.
2.  Understand how semantic structure impacts Screen Readers (Accessibility).
3.  Implement a SEO-friendly document structure.

---

## 🗺️ Visualizing the Structure

*The following diagram illustrates how semantic tags map to a standard web page layout:*

![HTML5 Semantic Layout Diagram](https://scaler.com/topics/images/basic-structure-of-html-document.webp)

## 🔑 Key Concepts

| Tag | Description | Best Use Case |
| :--- | :--- | :--- |
| **`<header>`** | Introductory content | Site logos, navigation bars, page titles. |
| **`<nav>`** | Navigation links | Major navigation blocks (e.g., Main Menu). |
| **`<main>`** | The dominant content | The unique content of the document. **Use once per page.** |
| **`<section>`** | Thematic grouping | A group of related content, usually with a heading. |
| **`<article>`** | Self-contained composition | Blog posts, news cards, forum comments. |
| **`<aside>`** | Indirectly related content | Sidebars, ad placements. |
| **`<footer>`** | Footer info | Copyright data, contact info, sitemaps. |

## 💻 Code Example

Here is a standard semantic boilerplate:

```html
<body>
  <header>
    <h1>My Website</h1>
    <nav>
      <a href="#home">Home</a>
      <a href="#about">About</a>
    </nav>
  </header>

  <main>
    <article>
      <h2>Understanding Semantics</h2>
      <p>Semantic HTML is important because...</p>
    </article>
  </main>

  <footer>
    <p>&copy; 2025 Lesson Series</p>
  </footer>
</body>