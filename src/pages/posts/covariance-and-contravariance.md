---
title: Covariance and Contravariance
pubDate: '2023-06-18T16:41:22.233Z'
description: What are they, and why are they so helpful?
layout: '../../layouts/BlogPost.astro'
---

While working the other day, I came across an interesting set of concepts. They
were something I used regularly while never really understanding how
they worked. These are the concepts of Covariance and Contravariance. Let's
start with a definition for "Variance" in a programming language.

> Type variance describes how type inheritance transforms itself in type
> parameters.

In other words, type variance allows us to reference things as if they were
sub-types or super-types and different kinds of variance define the rules for
doing so. For example, say we have a class of type Fruit and had subclasses of
types Orange, Apple, and Banana. What happens if we have a list of apples, and
then we try to assign that list of Apples to a variable that's a type of a list
of Fruits, what happens? These are the behaviors that Covariance and
Contravariance define.

## Covariance

Let's start with the book definition of Covariance:

> This allows a base type to be used where a derived type is expected.

To provide code for our fruit example earlier, Covariance allows the following
operation to happen:

```csharp
IEnumerable<Oranges> oranges = new Orange[] { };
IEnumerable<Fruit> fruits = oranges;
```

It allows us to take a list of things of one type, and then treat them as if
they were a list of their parent type. You can create your own generic
interfaces that are Covariant by using the `out` keyword as a generic
parameter. The following is an example of a Covariant interface:

```csharp
interface IMyCollection<out R>
{
    R GetItem();
}
```

There are constraints on these parameters though. The type can only be used as
a return type of interface methods and cannot be used in method arguments.
There is one exception to this rule, however. You can pass the type parameter
into a contravariant generic parameter, for example:

```csharp
interface IMyCollection<out R>
{
    void OperateOnEachItem(Action<R> callback);
}
```

This operation happens to be completely legal. You also cannot use the generic
as a type constraint for a generic within the interface. For example the
following will generate a compile time error:

```csharp
interface IMyCollection<out R>
{
    void Operate<T>() where T : R
}
```

## Contravariance

For a definition, we get:

> This allows a base type to be used where a derived type is expected

For example, continuing with the fruit examples, the following illustrates how
contravariance works:

```csharp
Action<Fruit> fruitProcessor = (item) => { ...actions with the fruit... };
Action<Oranges> orangeProcessor = fruitProcessor; //Yes this is indeed leagal
orangeProcessor(new Orage()); // This will compile and run just fine
orangeProcessor(new Grape()); // This will throw an error because it's narrowed the `item` type to only Oranges
```

The assignment of a fruit processor to a variable of type `Action<Orange>`
seems completely counter-intuitive here. It seems like that should be an illegal
operation. How can we assign a superclass type parameter to a subclass object?

While this makes sense from a conceptual standpoint, polymorphic behavior
would seem to suggest that the assignment won't work. This is no the case as
the type parameter T of the 'Action<T>' type is declared as contravariant. In C#
you can declare a type parameter as contravariant with the `in` keyword. For
example:

```csharp
interface IOperation<in A>
{
    void Compute(A variable);
    void Compute<T>() where T: A;
}
```

This is the exact opposite of Covariance. You use it as a type parameter or as
a type constraint on a Generic, but you cannot include it in the return type
of the method. This means the following would throw a compiler error:

```csharp
interace IOperation<in A>
{
    A Generate();
}
```

## Mixing Variance

You are also free to mix Covariant and Contravariant generic type parameters in
the same interface, for example:

```csharp
interface IBothVariances<out R, in A>
{
    R GetValue();
    void Compute(A variable);
    void Compute<T>() where T: A;
```

## Implementation

You implement the variant interfaces the same way you implement invariant
interfaces. No changes have to happen with how things should be implemented.

## Conclusion

Covariance and Contravariance aren't widely used outside the standard library
in C#, but they are powerful tools that may be very useful in certain
specific scenarios. If you want to learn more, the following are resources I
used when researching this topic:

- [Covariance and contravariance in generics](https://learn.microsoft.com/en-us/dotnet/standard/generics/covariance-and-contravariance)
- [Creating Variant Generic Interfaces (C#)](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/covariance-contravariance/creating-variant-generic-interfaces)
- [Covariance and contravariance real world example](https://stackoverflow.com/questions/2662369/covariance-and-contravariance-real-world-example)
