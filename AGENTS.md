<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Use TanStack leaf routes for each public section with shared chrome in the root layout, so navigation and metadata remain independently addressable.
- Keep captured public editorial content in a browser-safe data module and media in asset pointers, so rendering requires no source-platform runtime.
- Preserve the original public Google Apps Script form destinations; never claim submission delivery verified from an opaque no-CORS response.
