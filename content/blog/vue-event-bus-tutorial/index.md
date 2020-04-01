---
title: "How to Use a Vue.js Event Bus"
date: "2020-03-31T22:12:03.284Z"
description: "What are event busses in Vue.js and how do we go about using them?"
featuredImage: font-image.jpg
---

In Vue, sometimes there is a need to pass data between two components that are part of separate trees in the component hierarchy, for example there may be two tables on a page, and when one a user edits data in one table, data in the other must update. The table rows are part of two separate component trees. This may be what the component tree looks like:

![test image](./test.jpg "This is a test image")
