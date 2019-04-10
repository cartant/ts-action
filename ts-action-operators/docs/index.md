### Redux action operators with less TypeScript cruft

Compose NgRx effects and redux-observable epics like this:

```ts
actions
  .ofType(Books.Search)
  .toPayload()
```

Instead of like this:

```ts
actions
  .ofType<Books.Search>(Books.BookActionTypes.SEARCH)
  .map(action => action.payload)
```

<script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-103034213-2', 'auto');
    ga('send', 'pageview');
</script>