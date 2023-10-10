# Updating type declarations

Type declarations should be updated whenever types change - manually, for now.

1. Run `npm run types` to auto-update the types/\*.d.ts files

2. In the three root files `index.d.ts`, `index-cjs.d.ts` and `web-comopnent.d.ts`, add a missing Core JS import:

```js
import * as Userfront from "@userfront/core";
```

3. Save and commit changes
