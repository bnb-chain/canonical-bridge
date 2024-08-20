# @bnb-chain/icons

## Contributing

Follow the `chakra-ui`
[guidelines](https://chakra-ui.com/docs/media-and-icons/icon#using-the-createicon-function) to add a
new icon using the `createIcon` function.

The SVG must follow these rules:

- The SVG is monochromatic (or follows the naming convention if colored).
- You have replaced all `fill=""` attribute values with `"currentColor"`.
- The SVG viewport is a 24x24 square (e.g. `viewBox="0 0 24 24"`) and the icon is centered both
  horizontally and vertically in it.
- The .tsx file is named with pascal casing (e.g. `CaretDown.tsx`).
- The .tsx file is named with appropriate suffixes, in the correct order (e.g. `Tick.tsx`,
  `TickCircle.tsx`, `TickCircleSolid.tsx`).
  1.  `Circle` if the icon is circled.
  2.  `Solid` if the icon has a solid fill.
  3.  `Color` if the icon cannot change its color.
- The SVG file does not contain any font loading, styles or non-vector images.

Contact the designer if your icon has `stroke` attributes and ask them to convert it to `fill` so
the icon scales correctly.

Once the file has been added, it must be exported in [index.ts](./src/index.ts).
