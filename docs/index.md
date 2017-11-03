### Redux action creators with less TypeScript cruft.

Declare Redux actions like this:

```ts
export const Search = action({ type: "[Books] Search", ...payload<string>() });
export const SearchComplete = action({ type: "[Books] Search Complete", ...payload<Book[]>() });
export const SearchError = action({ type: "[Books] Search Error", ...payload<string>() });
```

Instead of like this:

```ts
export enum BookActionTypes {
  SEARCH = "[Books] Search",
  SEARCH_COMPLETE = "[Books] Search Complete",
  SEARCH_ERROR = "[Books] Search Error"
}

export class Search implements Action {
  readonly type = BookActionTypes.SEARCH;
  constructor(public payload: string) {}
}

export class SearchComplete implements Action {
  readonly type = BookActionTypes.SEARCH_COMPLETE;
  constructor(public payload: Book[]) {}
}

export class SearchError implements Action {
  readonly type = BookActionTypes.SEARCH_ERROR;
  constructor(public payload: string) {}
}
```