## Column Wrapper + Content (sample extraction)

This repo is a small, self-contained showcase of two cooperating UI components extracted from a larger application. It is meant to demonstrate responsive layout, context-driven coordination, and dynamic content placement for code showcasing.

### What’s here

- `column-wrapper` — a responsive grid wrapper that orchestrates layout and shares state via React Context
  - `column-wrapper/column-wrapper.jsx` — main layout component (`ColumnWrapper`)
  - `column-wrapper/components/CwProvider.js` — context provider and hook
  - `column-wrapper/components/DynamicallyPlacedContent.js` — renders a consolidated “eyebrow”/title area from shared context
  - `column-wrapper/components/DynamicallySourcedImage.js` — renders an image when its source is provided by context
  - `column-wrapper/column-wrapper.scss` — styles supporting classnames used by the wrapper and its children
- `content` — a flexible renderer for column content
  - `content/content.jsx` — main content component (`Content`)
  - `content/content.query.js` — GraphQL fragment assembly used by the original app (included for data shape reference)

### High-level architecture

1) `ColumnWrapper` lays out a CSS grid based on provided widths and alignment, and exposes a Context that children can use to coordinate behavior.

2) Each column is rendered by `Content`. Depending on the data, `Content` may “promote” certain bits of heading/eyebrow UI (icon, intro text, pill, title) into shared context so that `DynamicallyPlacedContent` can render them in a single consolidated location above the grid on small screens.

3) For image-first experiences, `Content` can render a `DynamicallySourcedImage` using a dynamic image source provided through the same shared context. On mobile, this image can instead be deferred to an accordion (outside this sample) based on the same flags.

Together, the two components demonstrate a clean separation of concerns:
- `ColumnWrapper` controls layout and shared state.
- `Content` focuses on rendering per-column data and feeding shared UI state when appropriate.

### Key files and responsibilities

- `column-wrapper/column-wrapper.jsx`
  - Accepts `columns` and layout props (`columnWidths`, `wrapperWidth`, `columnHorizontalAlignment`, `verticalAlignment`, etc.).
  - Computes responsive grid CSS with Emotion, using width fractions and wrapper alignment.
  - Derives behavior flags such as `shouldMakeHeadingDynamic` (true when columns include images/videos) and `shouldRenderDynamicImageInAccordionOnMobile`.
  - Provides context values: `dynamicContent`, `setDynamicContent`, `dynamicImageSource`, `setDynamicImageSource`, and the behavior flags.
  - Renders `DynamicallyPlacedContent` when shared `dynamicContent.title` exists, then renders each column via `Content`.

- `column-wrapper/components/CwProvider.js`
  - Minimal React Context wrapper used by the wrapper and content components.

- `column-wrapper/components/DynamicallyPlacedContent.js`
  - Reads `dynamicContent` from context and renders, in order: `leadingIcon`, `introText`, `pill`, `title`.
  - Uses helpers (from the original app) to colorize/format WYSIWYG markup.

- `column-wrapper/components/DynamicallySourcedImage.js`
  - Reads `dynamicImageSource` from context and renders an `Image` when present.

- `content/content.jsx`
  - Renders a column’s UI (pill, eyebrow/intro, image, components, rich text) using the data shape from Contentful.
  - When `shouldMakeHeadingDynamic` is true, on small screens it moves parts of the heading (icon, intro text, pill) into shared `dynamicContent` so `DynamicallyPlacedContent` can place them above the grid.
  - If the current item is a “dynamically sourced image,” it will render `DynamicallySourcedImage` (unless `shouldRenderDynamicImageInAccordionOnMobile` suggests deferring on mobile).
  - Applies background and alignment classes, and uses Emotion for inline computed styles.

- `content/content.query.js`
  - Provides the GraphQL fragments used by the original app. Included here to show the expected data shape for `Content` (images, pills, intro text, components, references, etc.).

### Props at a glance

- `ColumnWrapper` (selected props)
  - `columns` (array) — the column data passed through to `Content` per index
  - `columnWidths` or `columnWidthValues` — fractional widths (e.g., `"50 / 50"`) for grid template generation
  - `columnHorizontalAlignment` — left/center/right alignment of the grid within the wrapper
  - `verticalAlignment` — top/center/bottom alignment for items within each column
  - `wrapperWidth` — overall wrapper width mode (e.g., Fill Width)
  - `stackColumnsOnTablet` — toggles stacked layout at tablet widths
  - `roundedCorners`, `customClasses`, `mobileMedia`, `section`, `tfaFormData` — feature toggles and pass-through data

- `Content` (selected props)
  - Heading: `pill`, `leadingIcon`, `introText`, `introTextTag`, `introTextTagStyle`
  - Media: `desktopImage`, `tabletImage`, `mobileImage`, `large`, `medium`
  - Layout: `alignment`, `horizontalAlignment`, `backgroundColor`, `cssInJs`
  - Rich text: `text` with `references`
  - Components: `components` / `componentsCollection`
  - Dynamic image item: `__typename === 'ContentfulDynamicallySourcedImage'`

### Responsive and dynamic behavior

- When any column includes an image/video (or a nested image/video component), `ColumnWrapper` sets `shouldMakeHeadingDynamic`.
- On small screens, `Content` moves eyebrow bits (icon, intro text, pill) into `dynamicContent`; `DynamicallyPlacedContent` renders them once above the grid.
- For “dynamically sourced images,” `Content` either renders the image inline via `DynamicallySourcedImage` or, on mobile, defers to be rendered within an external accordion (as suggested by `shouldRenderDynamicImageInAccordionOnMobile`).

### Minimal usage example

```jsx
import ColumnWrapper from './column-wrapper';

const columns = [
  {
    __typename: 'ContentfulContent',
    pill: { /* pill props */ },
    leadingIcon: { /* icon props */ },
    introText: 'Short intro',
    text: { /* rich text data */ },
    components: [
      { __typename: 'ContentfulImage', /* image data */ },
      { __typename: 'ContentfulCtaButton', /* CTA data */ }
    ]
  },
  {
    __typename: 'ContentfulDynamicallySourcedImage',
    /* image source data; used by DynamicallySourcedImage */
  }
];

export default function Example() {
  return (
    <ColumnWrapper
      columns={columns}
      columnWidths="50 / 50"
      wrapperWidth="Fill Width"
      columnHorizontalAlignment="left"
      verticalAlignment="top"
      stackColumnsOnTablet
      roundedCorners
    />
  );
}
```

### Notes

- This sample intentionally references helper utilities and design tokens (e.g., Emotion CSS helpers, color utilities, breakpoints) from the original application for authenticity. Not all of those underlying modules are included here, as the goal is to show architecture and cooperation patterns rather than provide a runnable app.
- If you want an even quicker skim, start with `column-wrapper/column-wrapper.jsx` and `content/content.jsx` to see the context/data handoff and rendering logic end-to-end.


