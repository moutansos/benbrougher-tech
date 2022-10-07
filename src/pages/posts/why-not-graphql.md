---
title: Why Not GraphQL?
pubDate: '2022-10-06T19:01:22.233Z'
description: Why I don't use GraphQL for personal or work projects
layout: '../../layouts/BlogPost.astro'
---

Let me be clear right out of the gate. I don't dislike the idea of GraphQL. I love static types. C# and TypeScript are some of my favorite languages and I don't care for dynamic type systems in languages like Python and JavaScript. In general, when I write code without types, I feel unsure about how my code is going to run in the real world. Given the choice between the two, when building anything more than simple scripts, I want to reach for a typed language.

Even with all that buy-in for typed languages, I still haven't been able to bring myself to switch from REST endpoints over to using GraphQL. Maybe it's my lack of experience and knowledge, but I've tried many times to adopt it for both personal and work projects to no avail. I want to like it and use it. I can see how it should streamline my development process and make my life better but for many reasons, I haven't been able to adopt it. Whether they stem from ignorance, lack of experience or they are legitimate issues, here are the reasons why.

# Increased Complexity

By adopting GraphQL, you are buying into an additional layer of complexity. GraphQL uses a simple POST request under the hood to send the query and then receive data. This adds another layer on top of a web server which you need in addition to a GraphQL processing library on both the client and server side. In addition to this, you can say goodbye to dropping REST URLs in your browser to test things as everything is done via POST requests.

## You should share schemas between frontend and backend

One of the biggest advantages while using GraphQL is the ability to use types when using typed languages and share those types between client and server. This is great in concept, but in reality, this means that you need some way to turn GraphQL schemas into code. This then needs support both at development time and then build time to let TypeScript access these types during the compile step. You might argue that you should just be using JavaScript instead of TypeScript if worrying about build complexity, but using types in code is a huge boost in productivity and safety, and you end up trading types in code for types in transport at that point.  

Additionally, when sharing types, you have to make sure the frontend and backend schema match, otherwise strange errors can pop up. One might argue that the same can be said for using REST endpoints, but the fact that the compiler signs off on your actions means that you'll be thinking things are fine when that may not be true. If your types don't match, your frontend and backend are going to engage in nondeterministic behavior while everything compiles just fine. 

This brings us to another conundrum. What happens when your backend and frontend are separate apps in their own repos? How do you share schemas? Do you put the types into a library shared between the two housed in a third repo? Do you copy and paste the types from one project to another? Sharing schemas between frontend and backend necessitates a monorepo for your project. Arguably this restricts the horizontal scaling of your application across various micro-services.

# Optimization Gets More Complex

Another aspect that becomes more complex is optimization. Things like the n + 1 problem plague GraphQL and require a developer to think about and mitigate those issues earlier on. With a REST API, one might use some SQL and perform some joins and return a custom model to the client. In GraphQL, more often you end up using caching to cache your data from your resolvers. This means you'll be adding something Redis to your stack if you want to operate at scale. Again, my lack of knowledge in this area might mean that I'm not aware of some other way of architecting my resolvers and mutations to work around the issue, but I already have to solve that problem in my REST API and the benefit of static types while great starts to break down under this increased complexity and corresponding cognitive overhead.

# You Better Make Sure All Your Services are Written in JavaScript or TypeScript

What about if you want to have a backend that is written in multiple languages? The right tool for the right job right? Well if you pick up GraphQL, you'll find anything not built on NodeJS or Deno to be extremely lacking. I've tried to use .NET Core-based solutions, but the projects aren't very well maintained and don't have the visibility of something like ASP.NET Core. There's just not a high enough adoption rate to justify using these sorts of things in a work setting. ASP.NET Core for .NET and Express.js for NodeJS have been around for a long time and aren't going anywhere anytime soon. Same with things like Django and Flask for Python. To be clear, libraries do exist and they do technically work, but they tend to be clunky, unoptimized and missing features. One of the biggest is support for schema stitching and GraphQL federation.

# GraphQL Federation is Way Harder than REST API Gateways

If you adopt a microservices-style architecture and want to use GraphQL, you are left with a bit of a quandary. How do you stitch all those GraphQL services together into something coherent? The suggested way is through using something called GraphQL Federation. This requires standing up a service in front that can pull in the schemas of all your smaller services. That's great, but what do you do when you need to test with a frontend locally? When using a REST API, you simply change your base URL via some config and you presumably can run without a gateway and your frontend will be none the wiser. It's adding more complexity to the scaling process when that is already a complex topic to begin with. 

One of the best advice for building microservices architecture is to have "dumb pipes and smart endpoints." Adding GraphQL breaks this mantra and creates smart endpoints and smart pipes. Simple gateways become complex applications that stich schemas together and cache responses from microservices. From a design patterns standpoint, it's drastically increasing coupling between services and their gateway, but it's not increaseing cohesion. This breaks down, even more, when you start thinking about serverless functions. You either cram the whole API into a single serverless function, split your app into many tiny GraphQL endpoints, or figure out how to stitch together all your resolvers and mutations into a single interface for your frontend. Mix in some of the problems I've mentioned above with trying to make a serverless GraphQL API and all of a sudden you have an extremely complex problem on your hands, requiring duct tape and baling wire to make everything play together nicely. 

# Conclusion

Scaling GraphQL looks hard, and that's an issue for me. I don't necessarily expect all my apps to go viral and need to scale, but I'd like to pick an architecture that lends itself to scaling in the future and scaling REST APIs and REST serverless functions is a known quantity at this point. I don't want to lock myself into any specific language or architecture. Most of my points here, do have solutions or workarounds or can be fixed with architecture changes, but all those things when taken together, lead me to believe that we aren't quite to the point where static typing of the transport layer is a great option yet. 

I'd like to end this post with a bit of clarification on my position here. I see the gaps in REST APIs that GraphQL tries to fill. It's a segment of the market that seems ripe with the opportunity for a new library or protocol to come in and shake things up, and I want that. Maybe GraphQL can be that someday, but right now, it's too focused on a single vertical of the JavaScript ecosystem and the tooling. Support hasn't permeated into other languages and paradigms yet. It makes me wonder if something better might be on the horizon.
