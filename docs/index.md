### Redux action creators with less TypeScript cruft

Declare Redux action creators like this:

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

<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/jZB4ja6SvwGUN4ibgYVgUVYV/cartant/ts-action'>
  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/jZB4ja6SvwGUN4ibgYVgUVYV/cartant/ts-action.svg' />
</a>

<script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-103034213-2', 'auto');
    ga('send', 'pageview');
</script>