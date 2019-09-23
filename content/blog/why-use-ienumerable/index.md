---
title: Why Use IEnumerable?
date: "2019-09-22T22:12:03.284Z"
description: "What is IEnumerable in C#? And why should I use it?"
---

If C# is new to you, and you've been wondering what the heck this ```IEnumerable``` thing is about and why everyone uses it everywhere, you aren't alone. Other languages like Java don't have anything similar to it, and when using it you may run into issues like, "how do I add things to this list?", or "how do I change types from one to another". You may also ask yourself, "why not just add or remove items in a regular ```List``` and call it a day?" The answers lie in this post. By the end of it, you should will understand what ```IEnumerable``` is and how to not only understand the use case, but hopefully come out the other side of this blog post with the knowledge needed to build better applications. But first, what exactly is it?

# The Definition

For those already familiar with Iterators and Interfaces like the ones in Java, you might want to skip this definition and get into the real meat and potatoes below.

```IEnumerable``` is fundamentally an interface within the C# type system. It provides a contract between a calling bit of code, and the called bit of code. It serves to allow many very different things behave in the same way. The description of the ```IEnumerable<T>``` interface in particular (per Microsoft) is as follows:

> Exposes the enumerator, which supports a simple iteration over a 
> collection of a specified type.

If you've had exposure to design patterns at all, what they are calling an "enumerator" is essentially the Iterator within the Iterator Pattern. This basically means an object that knows how to "walk" over a list of items. For example, you can obtain and enumerator, that knows how to walk through an array, or a list, or a database, and you can iterate through each of them in exactly the same way. The generic nature of enumerators, allows other features, such as for-each loops, and LINQ, to leverage them in powerful ways, which we will visit below.

# Case for IEnumerable #1: Immutability

There is a large trend in the programming community towards a concept of immutability, that basically means the thing that you are working with is guaranteed not to change. ```IEnumerable``` does not guarantee that the object with in it is immutable, but it does guarantee that nothing can change the set of objects represented by the ```IEnumerable``` without creating a new variable of that type. Looking at the docs [here](https://docs.microsoft.com/en-us/dotnet/api/system.collections.generic.ienumerable-1?view=netframework-4.8), there are no methods for adding items, only for getting them. This seems like a major limitation, but in practice, it reduces errors and promotes writing clean, concise, intent-revealing code. It becomes obvious if the variable you are working with is a filtered version of the original list of items or not when the variable name reflects it. 

# Case for IEnumerable #2: LINQ Methods

The other advantage to using IEnumerable consistently, is the use of LINQ functions and statements. Instead of iterating over a collection, they provide a generic way for you to manipulate lists. A few of these that I use most frequently are below:

## The Where Method

You might have code that looks like the following:

``` csharp
using System;
using System.Collections.Generic;

namespace IEnumerable_Blog_Post
{
    class Program
    {
        private static readonly List<Car> CARS = new List<Car>()
        {
            new Car()
            {
                Make = "Ford",
                Model = "Edge"
            },
            new Car()
            {
                Make = "Ford",
                Model = "Mustang"
            },
            new Car()
            {
                Make = "Toyota",
                Model = "Supra"
            }
        };

        static void Main(string[] args)
        {
            List<Car> fordCars = new List<Car>();
            foreach (Car car in CARS)
                if(car.Make == "Ford")
                    fordCars.Add(car);
        }
    }

    class Car
    {
        public string Make { get; set; }
        public string Model { get; set; }
    }
}
```

Here I provide the car class and the list of cars for context, but I would like to bring your attention to the ```Main()``` method. We perform a simple operation, loop through the old array, and only put the cars that are of the model "Ford" in the new array. This is rather verbose and long winded. And it mutates the ```fordCars``` list as it is adding them. This is not idea, as it increases the chances of bugs. 

Using the ```Where``` method, the ```Main``` function looks something like this:

``` csharp
using System.Linq;

...

        static void Main(string[] args)
        {
            IEnumerable<Car> fordCars = CARS.Where(car => car.Make == "Ford");
        }
...
```

This makes the code more concise, and if you are accustomed to the syntax, makes it more simple to reason about.

## The Select Method

The next most useful LINQ method, in my experience, is the ```Select``` method. Imagine (using the same class and list) the following operation:

``` csharp
...
        static void Main(string[] args)
        {
            List<string> carNames = new List<string>();
            foreach (Car car in CARS)
                carNames.Add($"{car.Make} {car.Model}");
        }
...
```

(Ignoring that this could be solved with an overridden ```ToString``` method. This has the same problem as the above. It mutates a list to create a list separate from the original. In all actuality, with LINQ it could be written like this:

``` csharp
...
        static void Main(string[] args)
        {
            IEnumerable<string> carNames = CARS.Select(car => $"{car.Make} {car.Model}");
        }
...
```

This creates a fresh new ```IEnumerable``` object that contains the full names of the cars.

## The Union Method

Another is the ```Union``` method. Sometimes we might need to combine collections together into a single enumerable list. The following shows how you would combine the two:

``` csharp
using System.Collections.Generic;

namespace IEnumerable_Blog_Post
{
    class Program
    {
        private static readonly string[] PRIMARY_COLORS = new string[]
        {
            "Red",
            "Blue",
            "Green"
        };

        private static readonly string[] SECONDARY_COLORS = new string[]
        {
            "Yellow",
            "Cyan",
            "Magenta"
        };

        static void Main(string[] args)
        {
            List<string> colors = new List<string>();

            foreach (string color in PRIMARY_COLORS)
                colors.Add(color);

            foreach (string color in SECONDARY_COLORS)
                colors.Add(color);
        }
    }
}

```

A better way of performing this would be the following:

``` csharp
...
        static void Main(string[] args)
        {
            IEnumerable<string> colors = PRIMARY_COLORS.Union(SECONDARY_COLORS);
        }
...
```

This combines the two arrays into a single enumerable that can be iterated upon.

## Others

There are many other examples of LINQ methods, a few are listed here:

- ```Distinct``` - Gets only the unique items in the list
- ```SelectMany``` - Flattens the list of lists into a single list
- ```ToDictionary``` - Creates a dictionary from a list of items when shown how to access the key and value
- Many others listed [here](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable?view=netframework-4.8).

# Case for IEnumerable and LINQ #3: Performance

When using ```IEnumerable```s there is also the added advantage of being lazily evaluated. Chaining linq statements are only evaluated upon iteration. This means that no operation is performed until the collection is iterated over. Then it will perform the specified transforms.

## Aren't These like Streams in Java?

If you have experience with Java, you may be asking, aren't these very much like Java's Streams? The answer is they address the same problem, but they don't have the performance limitations or the restrictions that Streams do. ```IEnumerable```s are usually just as performant, or even more-so, than their simple foreach counterparts. In addition, you may iterate over the collection, not just once like Streams, but as many times as you wish. This removes most of the limitations of Streams while retaining the benefits (and using less code overall).

# Case for IEnumerable #4: Programming to and Interface, Not an Implementation

The last and final advantage to using ```IEnumerable``` over ```List``` is that by using the ```IEnumerable``` type, you are programming to an interface and not an implementation. This decreases the coupling on the collection underneath and provides a better way to manage collections of data. This is widely accepted as a good practice in object oriented coding, that leads to cleaner, easier to test code.

# Conclusion

This concept of ```IEnumerable``` is an extremely powerful one. It allows you to reduce boilerplate code while retaining performance. It is not without its downsides. Debugging requires more breakpoints and setting a breakpoint within a lambda is hard without breaking it into a code block. This however is weighed against the advantage of declaring transforms on data, rather than performing the underlying operations, decreasing the need for the debugger in the first place.