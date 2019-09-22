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

# Case for IEnumerable #2: LINQ Functions

The other advantage to using IEnumerable consistently, is the use of LINQ functions and statements. Instead of iterating over a collection, they provide a generic way for you to manipulate lists. A few of these that I use most frequently are below:

## The Where Function

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

Using the Where method, the Main function looks something like this:

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

# Case for IEnumerable #3: Performance

## Lazily Evaluated

## Aren't these like Streams in Java?

If you have experience with Java, you may be asking, aren't these very much like Java's Streams? The answer is they address the same problem, but they don't have the performance limitations or the restrictions that Streams do. ```IEnumerable```s are usually just as performant, or even more-so, than their simple foreach counterparts. In addition, you may iterate over the collection, not just once like Streams, but as many times as you wish. This removes most of the limitations of Streams while retaining the benefits (and using less code overall).

# Case for IEnumerable #4: Programming to and Interface, Not an Implementation

# Examples of Usage

# Conclusion