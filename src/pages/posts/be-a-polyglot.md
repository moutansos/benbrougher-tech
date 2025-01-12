---
tilte: Be a Polyglot
pubDate: '2024-10-18T21:23:13.000Z'
description: Don't rely on on only one stack
layout: '../../layouts/BlogPost.astro'
---

We've seen this sort of thing play out before. Companies have terms for their
product or platform and all of a sudden they change the game on you. The license
is different, the free tier is now gone, or the CEO turns out to be a loose
cannon. Whatever the reason, developers get burned often. We need to stop being
brittle. In our software stack choices, frameworks, platforms, vendors, and even
revenue streams, we need to better prepare for when something inevitably shifts
beneath us and we need to jump to more stable ground.

## This Isn't New

If you're of the opinion that this sort of thing never happens, let me list out
some key events in developer history here for you:

- WordPress is now engaged in legal battles with WP Engine over a trademark
  issue that wasn't an issue for years, until Automatic wanted their cut.
- Redis was taken from it's original creator and now owned by a company that
  changed the licensing, triggering multiple forks such as Valkey and <<
  whatever microsoft called theirs>>
- Planetscale killed off its free tier cutting off many smaller developers,
  companies and educators from free access to a MySQL database.
- RedHat effectively kills CentOS
- Oracle demanded that any company running their fork of Java in production
  needed to pay up.
- Oracale then goes on to do the same thing with MySQL triggering the MariaDB
  fork.
- Serverless offerings from AWS, Microsoft and Vercel (among others) are really
  really cheap.... until you actually have a bunch of users.

## Watching for Walled Gardens - The Burgeoning Beartrap

The real trick to this is identifying the walled gardens. We need to see when
the walls start closing in around us, or better yet see them before we even set
foot inside. Things like centralized defacto repositories and app stores are
probably the easiest of these to spot, but also things like high vs low friction
paths where the easy thing is the thing that locks you in to a specific cloud
provider, or a specific stack.

An example of this could be something like React vs HTMX with respect to the
requirement of SSR. On the React side of things, if you want SSR, your server
infrastructure HAS to be in JavaScript. It could be a number of different
runtimes, but fundamentally you tie yourself to the language specifically on the
backend. Many, many companies make this tradeoff and it's ultimately worth it,
but what if performance requirements force you out of the JS ecosystem? Then
you're looking into things like FFI and binding to a lower level language like
Rust or C++ to make the slow part of your app fast, or at the very least
offloading that process to another service, but then you incur the cost of the
network request overhead. React Server Components, don't address this either.
You still are tied to Node.js in this case without some sort of compatibility 
layer introduced. In contrast, something like HTMX doesn't tie you to a 
backend language. You are free to use any architecture on the backend you want,
all you need to do is be able to accept form post requests and render HTML in
a reply, and maybe if you're doing something complicated set a header or two.
Almost no lock-in with your stack at all. 

## Programming Languages

## Platforms

### Self Hosting

## Revenue Streams

## Contingency Plans

## Open Source Projects

That brings us to the elephant in the room: "Isn't open source safer because
someone can just fork it and start over?" And to that I would say: well maybe,
but also maybe not. Forking is one of the key mechanisms of open source. And it
has enabled projects to outlive their masters. But nothing says a project has to
be forked, and nothing says that the fork has to be good. Especially if it's a
nice project.

If you're at a large organization you might be able to prepare to fork the
project and take on the responsibility of maintaining that project, but I
suspect that's not feasible for the vast majority of software departments out
there. Maintaining software is expensive (as you dear reader probably know).

## Social Media

### Social Platforms

### Blogs

## Own Your Pipeline

## Conclusion
