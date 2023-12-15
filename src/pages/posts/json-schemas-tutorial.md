---
title: How to write a JSON Schema
pubDate: '2023-12-14T12:40:22.233Z'
description: How to write a JSON Schema and where they can be used
layout: '../../layouts/BlogPost.astro'
---

Often we have a JSON configuration file in our project or script. It corresponds to some sort of data we
are parsing or creating. Often we run into errors and inconsistencies with the items inside our
JSON configuration file and we end up needing to fix the file by hand. Instead, what if we
could get full language server/auto-complete support in our editor? What if our editor told us when we were
missing a required field? This is where JSON schemas shine.

## Getting Started

For this tutorial, lets frame a certain use case in mind. Lets say we have a to-do list. And on that
list, we have tasks that we have to create on a regular basis. To-do items may happen at any sort of
interval. We can have things happen daily, monthly, weekly, and yearly. These items can live in a
configuration file and then a script can run every day and determine from the configuration which
items to add. It can look a little something like this:

```json
{
  "daily": [
    {
      "title": "Check Inboxes",
      "checklistItems": ["Email", "Github Notifications", "RSS Feeds"],
      "labels": []
    },
    {
      "title": "Feed Fish 🐟🐠🐡",
      "labels": ["Pets"]
    }
  ],
  "weekly": [
    {
      "daysOfWeek": ["Monday", "Tuesday", "Wednesday"],
      "item": {
        "title": "Work Out",
        "labels": ["Health"],
        "checklistItems": ["Walking", "Running/Biking", "Toe Touches"]
      }
    }
  ],
  "monthly": [
    {
      "daysOfMonth": [10],
      "item": {
        "title": "Pay Internet Bill",
        "labels": ["Financial"]
      }
    }
  ],
  "yearly": [
    {
      "month": "January",
      "dayOfMonth": 15,
      "item": {
        "title": "Prune Grapes",
        "labels": ["Garden"]
      }
    },
    {
      "month": "January",
      "dayOfMonth": 15,
      "item": {
        "title": "Prune Fruit Trees",
        "labels": ["Garden"]
      }
    }
  ]
}
```

Here we have our different schedules. We have the items we want to create, along with their sub
tasks. We also have the labels we can tag our items with to help organize them. All this data needs
to be correct for our script to run properly. If something is wrong, we could be in a situation where
our script will fail and no to-do items are added! We might not remember to pay the internet bill!

### Building a Schema

Lets start by making a `todo-list-recurring-items-v1.json` file. We will add the following metadata
to it:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://benbrougher.tech/schemas/todo-list-recurring-items-v1.json",
  "title": "Todo List Recurring Items",
  "description": "A set of todo list items that recur on a regular basis"
}
```

The top property `$schema` is the schema for our schema. It points to the file that contains the
structure for our file. If you want an LSP to start auto-completing properties and telling you if
you are missing things in your file, you'll add this property to the top level of your JSON file.
This URL is just a reference to another schema file.

> NOTE: If you have an array as a top level item, you can't reference the schema via the file itself
> and you'll have to configure your editor to point to a schema based on the file name. For example
> here is the documentation on how to change this in [VS Code](https://code.visualstudio.com/docs/languages/json#_mapping-in-the-user-settings).

The ID of the file is usually the URL that the schema will be published to. I make sure to include
a version number in the name as there's no other good way to manage multiple versions. The title and
description both provide other ways to provide more data about your schema, but are optional.

Now we can start adding some structure. Lets add the following property to the schema object:

```json
{
  .... things above ...
  "type": "object",
  "properties": {
    "daily": {
      "description": "A list of items that recur daily",
      "type": "array",
      "items": {
        "type": "object",
        "description": "A todo list item",
        "properties": {
          "title": {
            "description": "The title of the todo list item",
            "type": "string"
          },
          "checkListItems": {
            "description": "A list of items that need to be checked off",
            "type": "array",
            "items": {
              "type": "string",
              "description": "A check list item"
            }
          },
          "labels": {
            "description": "A list of labels to apply to the todo list item",
            "type": "array",
            "items": {
              "type": "string",
              "description": "A label"
             }
          }
        },
      }
    }
  }
}
```

Here we are saying that our top level type is an object, and the properties within it are a single
field called `daily` which is an array. This array contains items which are also objects. Each of
those objects represent our items in the array. Those objects contain fields with different types
like strings, and arrays of strings that represent the item title, checklist items and labels. But,
what if we wanted to make the `title` and `labels` required, while leaving the `checkListItems`
optional? We would add a `required` property and it would look something like this:

```json
{
  .... things above ...
  "type": "object",
  "properties": {
    "daily": {
      "description": "A list of items that recur daily",
      "type": "array",
      "items": {
        "type": "object",
        "description": "A todo list item",
        "properties": {
          "title": {
            "description": "The title of the todo list item",
            "type": "string"
          },
          "checkListItems": {
            "description": "A list of items that need to be checked off",
            "type": "array",
            "items": {
              "type": "string",
              "description": "A check list item"
            }
          },
          "labels": {
            "description": "A list of labels to apply to the todo list item",
            "type": "array",
            "items": {
              "type": "string",
              "description": "A label"
             }
          }
        },
        "required": [
          "title",
          "labels"
        ]
      }
    }
  }
}
```

There at the bottom we can define what fields we want to make sure our language server will require.

### Increasing Complexity

Now, we have a field with daily work items defined, but now we need to define the weekly property.
We could simply copy and paste our types into the other properties and the LSP would still work, but
if we needed to change any fields in the to-do item we would need to change it in multiple places.
The JSON Schema spec outlines a way for us to avoid this by defining common types within our schema.

We move our to-do item into its own type definition. It will look a little like this:

```json
{
  .... things above ...
  "type": "object",
  "properties": {
    "daily": {
      "description": "A list of items that recur daily",
      "type": "array",
      "items": {
        "$ref": "#/$defs/todo-list-item"
      }
  },
  "$defs": {
    "todo-list-item": {
      "type": "object",
      "description": "A todo list item",
      "properties": {
        "title": {
          "description": "The title of the todo list item",
          "type": "string"
        },
        "checkListItems": {
          "description": "A list of items that need to be checked off",
          "type": "array",
          "items": {
            "type": "string",
            "description": "A check list item"
          }
        },
        "labels": {
          "description": "A list of labels to apply to the todo list item",
          "type": "array",
          "items": {
            "type": "string",
            "description": "A label"
          }
        }
      },
      "required": [
        "title",
        "labels"
      ]
    }
  }
}
```

Here we define the type within the `$defs` property. This is a special property used for defining
shared types within a schema. The `$ref` property is also a special property that lets us reference
that defined type using a path syntax. The `#` at the front of the `$ref` tells the language server
to look in the current schema file. Then it says look inside the `$def` path. After that we can reference
our type name and it will be used in place of an explicit object definition.

### Adding more types

Next we'll add our weekly property to our schema, it'll look something like this:

```json
{
  ...other types ...
  "weekly": {
    "description": "A list of items that recur weekly",
    "type": "array",
    "items": {
      "type": "object",
      "properties": {
        "daysOfWeek": {
          "type": "array",
          "description": "The days of the week that the item should recur on",
          "items": {
            "type": "string",
            "enum": [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday"
            ]
          }
        },
        "item": {
          "$ref": "#/$defs/todo-list-item"
        }
      },
      "required": [
        "daysOfWeek",
        "item"
      ]
    }
  },
  ... $defs ...
}
```

This property defines what our weekly items will look like, with an array of items that contain the
`daysOfWeek` as well as the item itself. The `daysOfWeek` property is a string type, but we can tell
the language server what values are accepted inside that property with the `enum` property. Again, we
can see that the `item` prop is just referencing us our predefined type below.

Next, lets add our monthly values to see another example of constraining values:

```json
{
  ... other types ...
  "monthly": {
    "description": "A list of items that recur monthly",
    "type": "array",
    "items": {
      "type": "object",
      "properties": {
        "daysOfMonth": {
          "type": "array",
          "description": "The days of the month that the item should recur on",
          "items": {
            "type": "integer",
            "minimum": 1,
            "maximum": 31
          }
        },
        "item": {
          "$ref": "#/$defs/todo-list-item"
        }
      },
      "required": [
        "daysOfMonth",
        "item"
      ]
    }
  },
  ... $defs ...
}
```

Here in the `daysOfMonth` property we can see that the type is that of an integer, but also we can
see that there are constraints on what that value can be. It's only able to hold a value between 1
and 31, and anything that's put in outside that range will cause the language server to show a
problem on that line.

After combining what we used above we can extrapolate the yearly value and the finished schema looks
like this:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://benbrougher.tech/schemas/todo-list-recurring-items-v1.json",
  "title": "Todo List Recurring Items",
  "description": "A set of todo list items that recur on a regular basis",
  "type": "object",
  "properties": {
    "daily": {
      "description": "A list of items that recur daily",
      "type": "array",
      "items": {
        "$ref": "#/$defs/todo-list-item"
      }
    },
    "weekly": {
      "description": "A list of items that recur weekly",
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "daysOfWeek": {
            "type": "array",
            "description": "The days of the week that the item should recur on",
            "items": {
              "type": "string",
              "enum": [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
              ]
            }
          },
          "item": {
            "$ref": "#/$defs/todo-list-item"
          }
        },
        "required": [
          "daysOfWeek",
          "item"
        ]
      }
    },
    "monthly": {
      "description": "A list of items that recur monthly",
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "daysOfMonth": {
            "type": "array",
            "description": "The days of the month that the item should recur on",
            "items": {
              "type": "integer",
              "minimum": 1,
              "maximum": 31
            }
          },
          "item": {
            "$ref": "#/$defs/todo-list-item"
          }
        },
        "required": [
          "daysOfMonth",
          "item"
        ]
      }
    },
    "yearly": {
      "description": "A list of items that recur yearly",
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "dayOfMonth": {
            "description": "The days of the month that the item should recur on",
            "type": "integer",
            "minimum": 1,
            "maximum": 31
          },
          "month": {
            "description": "The months of the year that the item should recur on",
            "type": "string",
            "enum": [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December"
            ]
          },
          "item": {
            "$ref": "#/$defs/todo-list-item"
          }
        }
      },
      "required": [
        "dayOfMonth",
        "month",
        "item"
      ]
    }
  },
  "required": [
    "daily",
    "weekly",
    "monthly",
    "yearly"
  ],
  "$defs": {
    "todo-list-item": {
      "type": "object",
      "description": "A todo list item",
      "properties": {
        "title": {
          "description": "The title of the todo list item",
          "type": "string"
        },
        "checkListItems": {
          "description": "A list of items that need to be checked off",
          "type": "array",
          "items": {
            "type": "string",
            "description": "A check list item"
          }
        },
        "labels": {
          "description": "A list of labels to apply to the todo list item",
          "type": "array",
          "items": {
            "type": "string",
            "description": "A label"
          }
        }
      },
      "required": [
        "title",
        "labels"
      ]
    }
  }
}
```

This file can be published in any website and then referenced by anyone working in that type of file.

## Conclusion

As stated above, we can use the `$schema` property in our file to start validating types within the
file we are writing or editing. This can prove to be extremely helpful when editing files. If you
would like to learn more, please check out [json-schema.org](https://json-schema.org/) for more
documentation and examples. I hope this guide will help you save time and avoid errors in the future!
