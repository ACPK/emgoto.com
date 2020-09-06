---
title: "Building a web-monetized RSS reader using Blitz.js"
date: 2020-05-22
tags: ["blitz"]
category: "blog"
emoji: 📃
coverImage: 'https://images.unsplash.com/photo-1526721940322-10fb6e3ae94a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80'
---

RSS readers allow users to conveniently consume content from multiple websites in the one place. In this post I'll be going through how to create one using the recently announced [Blitz.js](https://github.com/blitz-js/blitz) framework, and how we can easily set it up to be web-monetized.

## Creating an app with Blitz.js

Blitz.js lets you create a full-stack React app, built on top of [Next.js](https://nextjs.org/). It's great for developers who know React and need a backend for their project, but might not be comfortable enough in other frameworks like Rails to get going quickly. It's still in Alpha, so I wouldn't recommend using it for anything too important (yet) but a side project is a great time to give it a go. 

> As of publishing this post, Blitz.js is on version 0.11.0. Keep in mind that parts of this post may become out of date by the time you read this.

First we need to install blitz and create an app using the `blitz new` command:

```bash
npm i -g blitz
blitz new monetized-feed
cd monetized-feed
blitz start #starts up your app at http://localhost:3000
```

> If you're looking for additional resources on getting started with Blitz.js, their [Blitz Tutorial](https://github.com/blitz-js/blitz/blob/canary/TUTORIAL.md) or [Getting Started with Blitz](https://blitzjs.now.sh/docs/basics/getting-started) guides are a great place to start - this post wouldn't have been possible without them!

## Creating a model

After making your Blitz app, the first thing you'll need is a database table, where we are going to store all of our RSS feeds. This database will store four things:

- The name of the RSS feed
- An RSS feed URL with non-monetized content (the "public" feed)
- An RSS feed URL with monetized content (the "private" feed)
- The RSS feed owner's payment pointer

> You may be wondering how a site may have both a private and a public RSS feed - I'll be covering how we can implement this in Gatsby in a future post.

Open your `db/schema.prisma` file and add your new model to the bottom:

```bash
model Feed {
 id          Int      @default(autoincrement()) @id
 name        String
 privateUrl  String
 publicUrl   String
 pointer     String
}
```

After you save this new model, run the following command:

```bash
blitz db migrate
```

It will prompt you to choose a name for your migration. You can type in anything you like, e.g. "create feed model" .

## Generate queries and mutations

So now that we have a `Feed` model, we're going to need a way of talking to our database so that we can add and and remove feeds. We can use the `blitz generate` command to generate some files that can do this:

```bash
blitz generate crud feed
```

This will create two new folders for us:

- `app/feeds/mutations` - contains functions that allow us to create, update, edit and delete feeds
- `app/feeds/queries` - contains functions that allow us to get all feeds, or to grab a specific one using an ID

## Create a settings page where we can add fields

The first thing our app is going to need is a UI where we can add new feeds. For now we'll be allowing anyone to add a new feed via our settings page, which will live at `/settings`.

Blitz.js is built on top of Next.js, which uses [file names to determine routes](https://nextjs.org/docs/routing/introduction). What this means is that by creating a file at `pages/settings.tsx`, we will be rendering the component defined in that file when a user lands on the `/settings` route. 

Inside this file, we'll be creating a simple form that allows us to input the values we need to save a new feed to our database:

```jsx
// app/pages/settings.tsx

import { useState } from "react"
import createFeed from "app/feeds/mutations/createFeed"

const initialState = {
  name: "",
  publicUrl: "",
  privateUrl: "",
  pointer: "",
}

const SettingsPage = () => {
  const [formState, setFormState] = useState(initialState)

  const onChange = (event) => {
    const { name, value } = event.target
    setFormState({ ...formState, [name]: value })
  }

  const onSubmit = (state, event) => {
    event.preventDefault();
    try {
      createFeed({ data: state })
    } catch (error) {
      console.log("Error creating feed", error)
    }
  }

  return (
    <>
      <h1>Settings</h1>
      <form onSubmit={(event) => onSubmit(formState, event)}>
        <input type="text" name="name" value={formState.name} onChange={onChange} />
        <input type="text" name="publicUrl" value={formState.publicUrl} onChange={onChange} />
        <input type="text" name="privateUrl" value={formState.privateUrl} onChange={onChange} />
        <input type="text" name="pointer" value={formState.pointer} onChange={onChange} />
        <input type="submit" value="Create" />
      </form>
    </>
  )
}

export default SettingsPage;
```

Now if you start up your Blitz app using `blitz start`, and navigate to `localhost:3000/settings`, you'll be able to create any number of feeds.

> In the interests of keeping the code examples small and this post as short as it can be, the UI is very sparse - you could improve on it by adding the ability to delete or edit existing feeds.

## Fetching and displaying a list of feeds on the home page

Next we'll want to fetch all the RSS feeds stored in our database, and display a list of them on our home page. You'll need to open the `pages/index.tsx` file, and replace all the code in there with the following:

```jsx
// app/pages/index.tsx

import { Suspense } from "react"
import { useQuery, Link } from "blitz"
import getFeeds from "app/feeds/queries/getFeeds"

const Feeds = () => {
  const [feeds] = useQuery(getFeeds, { where: {} })

  return feeds.map((feed, index) => (
    <Link href={`/feeds/${feed.id}`} key={index}>
      <div>{feed.name}</div>
    </Link>
  ))
}

const FeedsPage = () => (
  <Suspense fallback={<div />}>
    <Feeds />
  </Suspense>
)

export default FeedsPage
```

This will fetch all the feeds from the database using the `getFeeds` query. You'll notice that we've wrapped this in a `React.Suspense` component - any component that depends on a query to render will need to be wrapped in this component, so that you can show a loading state while the data is being fetched.

We've also wrapped each feed in a `Link` component that links out to `/feeds/{id}`. We'll be implementing this in the next section.

## Getting posts from an RSS feed

So far we've fetched from our database a list of RSS feeds. To get the actual posts from each of these feeds, we'll need to call the feed's URL.

If we do this on the client-side we'll run into CORS issues, and anyone smart enough to look at the network tab will be able to see the URL for the private RSS feed. Since this is a full-stack app, we can instead make this call on the server-side. We'll be installing the [rss-parser](https://www.npmjs.com/package/rss-parser) package to make things easier for us:

```jsx
yarn add rss-parser
```

This package does the work of calling the RSS feed, grabbing the data as XML, and transforming it into a JavaScript object and returning it to us. 

If you open up the `feeds/queries/getFeed.ts` file you'll see this is where we fetch a specific feed from our database. We'll be adding some extra functionality so that after getting the feed from the database, it will go ahead and fetch the data from the private and public RSS feed URLs using the `rss-parser`.

```jsx
// app/feeds/queries/getFeed.ts

import db, { FindOneFeedArgs } from "db"
import Parser from "rss-parser"

export default async function getFeed(args: FindOneFeedArgs) {
  const feed = await db.feed.findOne(args)
  const { name, privateUrl, publicUrl, pointer } = feed;

  const parser = new Parser()
  const publicFeed = await parser.parseURL(publicUrl);
  const privateFeed = await parser.parseURL(privateUrl);
  
  return { name, publicFeed, privateFeed, pointer };
}
```

> Note that I don't know the best practices for building Blitz.js app, and it may be that there is a separate place that getting this RSS data should live. Please let me know if you know!

## Rendering the feed's posts

Next we'll want to create a page for each feed, where a list of all the posts will be rendered. We'll be doing this at the `/feeds/{id}` route. 

This means we need to create a file at `feeds/pages/feeds/[id].tsx`. We use the square brackets (`[]`) in file names to define URL parameters that we can access from our code.

> We could also create the page at `pages/feeds/[id].tsx`, but by putting it under the `feeds` folder, we'll be keeping it alongside the queries and mutations that it will be using

Using the results of this `getFeed` query, we can render a list of a site's posts:

```jsx
// app/feeds/pages/feeds/[id].tsx

import { Suspense } from "react"
import { useRouter, useQuery } from "blitz"
import getFeed from "app/feeds/queries/getFeed"

export const Feed = () => {
  const router = useRouter()
  const id = parseInt(router?.query.id as string)
  const [feed] = useQuery(getFeed, { where: { id } })
  const {
    name,
    publicFeed: { items },
    pointer,
  } = feed

  return (
    <>
      <h1>{name}</h1>
      {items.map((item, index) => (
        <>
          {item.title}
        </>
      ))}
    </>
  )
}

const FeedPage = () => (
  <Suspense fallback={<div />}>
    <Feed />
  </Suspense>
)

export default FeedPage
```

Here we're making use of the feed ID in the URL that is available to us through `useRouter`, and calling the `getFeed` query to get a list of `items` (i.e. the posts).

You'll notice I'm only using the public RSS feed here - I'm making the assumption that a private RSS feed and public RSS feed will contain the exact same posts, with the differentiator being that the private feed will contain additional monetized content.

To make this page monetized, we can add the feed's `paymentPointer` to the meta tags by rendering the `Head` component:

```jsx
import { Head } from "blitz"

return (
  <>
    <Head>
      <meta name="monetization" content={`${pointer}`} />
    </Head>
```

## Linking each post to its own individual page

Next we'll need to be able to click on each individual post to view the content. Since we're not storing posts in our database, we're going to need a way of referring to each post.

I've created a utility function called `getSlug` that constructs a slug from the title of the post. If a post was titled "Hello world", its slug would be "hello-world".

```jsx
// app/utils/index.ts

// Creates slug using first 10 - 15 characters of title
export const getSlug = (title: string): string => {
  const array = title.split(" ")
  const newArray = []

  if (array[0].length > 15) {
    return array[0].slice(0, 14)
  }

  let counter = 0

  array.forEach((word) => {
    if (counter + word.length < 15) {
      newArray.push(word.toLowerCase())
      counter += word.length
    }
  })

  return newArray.join("-")
}
```

> I wouldn't recommend using `getSlug` in a production environment - I haven't factored in what would happen if a feed had two posts with the same title, or if it used any special characters.

We can add this slug and a `Link` component around each of our post titles:

```jsx
<Link href={`/feeds/${id}/${getSlug(item.title)}`} key={index}>
  {item.title}
</Link>
```

## Rendering the contents of a specific post

Now that we can click on a specific post from a feed, we'll need to construct a page that lets us render this post:

```jsx
// app/feeds/pages/feeds/[id]/[slug].tsx

import { Suspense } from "react"

const Post = () => <div />

const PostPage = () => {
  return (
    <Suspense fallback={<div>loading</div>}>
      <Post />
    </Suspense>
  )
}

export default PostPage
```

Similarly to the `Feed` component, we'll use `useRouter` and `getFeed` to get the feed's ID data. This time we'll also be getting the `slug` variable from the URL as well:

```jsx
const Post = () => {
  const router = useRouter()
  const id = parseInt(router?.query.id as string)
  const slug = router?.query.slug as string
  const [feed] = useQuery(getFeed, { where: { id } })
  const { publicFeed, privateFeed, pointer } = feed

  return <div/>
}
```

Now we have a list of posts, and a slug, but we don't know which post corresponds to the slug. We can find the index of the post using another utility function:

```jsx
// app/utils/index.ts

export const findPostIndexFromSlug = (slug: string, posts) => {
  let index = 0
  for (let post of posts) {
    if (getSlug(post.title) === slug) {
      break
    }
    index++
  }
  return index
}
```

Then in our `Post` component we'll need to use this to find the specific post:

```jsx
import { findPostIndexFromSlug } from "../../../utils"

// Inside of the Post component:
const postIndex = findPostIndexFromSlug(slug, publicFeed.items)
const publicPost = publicFeed.items[postIndex];
const privatePost = privateFeed.items[postIndex];
```

Next, we can render the content of the public post - which is stored as a blob of HTML. 

```jsx
return (
  <div>
    <h1>{publicPost.title}</h1>
    <div dangerouslySetInnerHTML={{ __html: publicPost['content:encoded'] }} />
  </div>
)
```

However, `dangerouslySetInnerHTML` is dangerous for a reason - we don't know the contents of the HTML that we are rendering, and we may be opening ourselves up to XSS attacks. For this reason, we should add a package that sanitises the data first, and makes it safe to render:

```jsx
yarn add xss
```

Wrap the `xss` function around your post data like this:

```jsx
import xss from "xss"

<div dangerouslySetInnerHTML={{ __html: xss(publicPost["content:encoded"]) }} />
```

## Adding web monetization to each post

The final step is to show the post from the private RSS feed if we have web monetization enabled. We can use the `useMonetization` hook in my previous post about [web monetization in React](/react-web-monetization).

With this hook, we can choose whether to show the `privatePost` or the `publicPost`. We also need to add the monetization meta tag using the `Head` component:

```jsx
const { isMonetized, isLoading } = useMonetization()

if (isLoading) {
  return <div>Loading...</div>
}

const post = isMonetized ? privatePost["content:encoded"] : publicPost["content:encoded"]

return (
  <div>
    <Head>
      <meta name="monetization" content={`${pointer}`} />
    </Head>
    <h1>{publicPost.title}</h1>
    <div dangerouslySetInnerHTML={{ __html: xss(post) }} />
  </div>
)
```

And done! Now you will have created:

- A settings page where you can add new RSS feeds
- A home page where you can view all RSS feeds
- A page to view a feed's list of posts (with web monetization!)
- A page to view a specific post, with monetized content only available if you are sending micropayments

## What's next?

At this point the app you will have created will be fairly ugly and missing a lot of key functionality. You can style your app the same way you would style your React app normally, such as with a CSS-in-JS library like [styled-components](https://github.com/styled-components/styled-components).

Each time you navigate to a feed's page, and to a specific post, you are re-fetching the data from the RSS feed. It would be better to implement some sort of mechanism that allows these calls to be cached so that you don't need to fetch things needlessly.

Another important thing to be implemented would be a system that allows for creation of accounts that so that users can save and follow their favorite RSS feeds. And the list goes on - there are a nearly endless number of features that could be added, and I hope this post has been able to help you get started!

## In conclusion - my thoughts on Blitz.js so far

In my short time with Blitz.js I experienced two pain points: 

1. I was initially confused that usage of the `useQuery` hook needs to be wrapped in `React.Suspense`. I'm used to the pattern where the hook may return null and you factor that in when you're rendering things e.g.

```jsx
const data = useHook();
return data ? <DataComponent data={data}/> : <LoadingComponent/>
```

2. After doing a mutation, I would expect the `useQuery` hook to return the updated data - but instead it continued to return the same stale data, even after a re-render. After modifying the data stored in the database, I had to refresh to get my changes to show up.

Overall, as a React developer, this was a super simple way to get an app set up with a back-end - much easier than trying to learn Rails! I'm excited to see where Blitz.js goes in the future.

---

This is part of my submission for DEV's Grant for the Web hackathon. I will be following on from this with a post about how we can create private / public URL feeds for Gatsby, and then a final post tying everything together, so please stay tuned for that.

Thanks for reading!