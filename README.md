# ShoeFinder

A simple, mobile-friendly shoe brand aisle locator.

## Current starter version

- Searchable brand picker with partial-match and typo-tolerant suggestions
- Displays the aisle as soon as a brand is selected
- Sample entries: Nike — Aisle 1, Adidas — Aisle 2, Rebook — Aisle 3
- Separate admin setup page explaining the secure shared-data step

## Publish with GitHub Pages

1. Open the repository **Settings**.
2. Select **Pages** in the sidebar.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Choose branch **main** and folder **/(root)**, then save.
5. Wait for GitHub Pages to publish the site.

The repository is `felipebresq/Shoe-finder`. The expected site address is:

`https://felipebresq.github.io/Shoe-finder/`

## Admin and shared data

The current brand list is in `app.js`. This is starter data, not a shared admin system. The admin page is intentionally a setup notice: a client-side password would not be secure, and browser local storage would not synchronize changes for all users.

The next phase should connect Supabase (or an equivalent hosted database) with authenticated admin access and a public read-only brand/location list. No credentials or secrets should be committed to this repository.
