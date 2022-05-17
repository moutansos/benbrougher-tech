---
title: 'XML Serialization and Deserialization with C#'
date: '2022-04-23Z27:29:03.342Z'
description: 'How to parse and serialize XML with C# in .NET 6'
featuredImage: 'TODO.jpg'
layout: '../../layouts/BlogPost.astro'
---

Sometimes in the course of our work, we run into APIs that aren't using modern technologies. Before JSON and REST, the dominant standards for APIs was XML and SOAP. The SOAP specification, originally released in 1999 and last updated in 2007. It has not seen significant change over the years. SOAP itself is rather old, it predates JSON which didn't become fully standardized until 2013 (although it had been in use since 2001). This mean the defacto standard of SOAP APIs is to use XML. This means there are a litany of old APIs still on the internet using XML and SOAP. Chances are, if you do enough integration of disparate systems, you'll run across a few of them in your career. 

SOAP is not commonly used when compared to REST, or even GraphQL APIs. On that note, like GraphQL, all SOAP endpoints generally are sent via HTTP POST requests to a single URL endpoint. The differing body of the POST determines which code the server will execute. Also, like GraphQL, SOAP has a sister specification that defines a language that can define format of requests, known as Web Service Description Language or WSDL for short. This language can define the structure of requests very similarly to how GraphQL types define the format of requests. 