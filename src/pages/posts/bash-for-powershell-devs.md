---
title: Bash for PowerShell Developers
pubDate: '2024-04-16T21:36:29.000Z'
description: How to write bash if you know a little PowerShell
layout: '../../layouts/BlogPost.astro'
---

I have a confession to make. Up until recently I didn't know how to write a bash script. I started
my career on Windows, so PowerShell was the logical choice and for cross platform scripts I always
reached for Node.js. But recently I've been moving away from writing JavaScript and I also didn't
want to have to install PowerShell on every Linux machine I wanted to run a script on. So I decided
to level up a bit and learn how to write bash scripts.

This is the guide I wish I had. It's not comprehensive, but it is enough to make you feel comfortable
writing bash scripts and hit the ground running. It also serves as a reference for the most common
things you'll (read I'll) need to do.

## Variables

In PowerShell, you declare variables and reference them both by prefixing the variable name with a
dollar sign:

```powershell
$myVariable = "Hello, World!"
Write-Host $myVariable
```

In bash, you declare variables by assigning a value to them without a dollar sign:

```bash
my_variable="Hello, World!"
echo $my_variable
```

In bash convention for variable names is to use all lower, snake case letters. As opposed to 
PowerShell where the convention is to use `PascalCase` or `camelCase`.

## Arrays

For arrays in PowerShell you use the `@()` syntax:

```powershell
$myArray = @("Hello", "World")
Write-Host $myArray[0]
```

In bash, you declare an array by using parentheses and you access elements by using square brackets
similar to PowerShell. The `declare -a` afterwards defines it as an array. Unlike PowerShell, you 
don't have a comma between elements in the array:

```bash
declare -a my_array=("Hello" "World")
echo ${my_array[0]}
```

## Conditionals

When writing conditionals in PowerShell you use the `if`, `elseif`, and `else` keywords:

```powershell
if ($myVariable -eq "Hello, World!") {
    Write-Host "It's true"
} elseif ($myVariable -eq "Goodbye, World!") {
    Write-Host "It's false"
} else {
    Write-Host "It's neither. The Universe is a lie."
}
```

In bash, you use the `if`, `elif`, and `else` keywords:

```bash
if [ $my_variable = "Hello, World!" ]; then
    echo "It's true"
elif [ $my_variable = "Goodbye, World!" ]; then
    echo "It's false"
else
    echo "It's neither. The Universe is a lie."
fi
```

The syntax here is admittedly a little weird and takes some getting used to. The weirdest thing to
me is not using a double equals in the equality, but hey, PowerShell uses `-eq` so who am I to
judge?

## Loops

In PowerShell you have the `foreach` loop:

```powershell
foreach ($item in $myArray) {
    Write-Host $item
}
```

And the `while` loop:

```powershell
$i = 0
while ($i -lt $myArray.Length) {
    Write-Host $myArray[$i]
    $i++
}
```

In bash you have the `for` loop:

```bash
for item in "${my_array[@]}"; do
    echo $item
done
```

Also available in bash is the `while` loop:

```bash
i=0
while [ $i -lt ${#my_array[@]} ]; do
    echo ${my_array[$i]}
    i=$((i + 1))
done
```

Again, the syntax is a little weird, but it's not too hard to understand. The `@` symbol is used to
reference the entire array in bash, and the `#` symbol is used to get the length of the array. `-lt`
is used to compare if one number is less than another.

## Functions

The syntax for functions in PowerShell is:

```powershell
function SayHello {
    param (
        [string]$name
    )

    Write-Host "Hello, $name!"
}

SayHello -name "World"
```

When in bash, you declare and call a function like this:

```bash
function say_hello {
    name=$1

    echo "Hello, $name!"
}

say_hello "World"
```

## Command Line Arguments

In PowerShell you can declare your script to take arguments like this:

```powershell
param (
    [string]$name
)

Write-Host "Hello, $name!"
```
It looks exactly like declaring a function parameter, but it's at the top of the script. Similarly,
you use the `$1`, `$2`, etc., syntax to access the arguments passed to the script itself as well.

In bash, you access the arguments passed to the script using `$1`, `$2`, etc.:

```bash
name=$1

echo "Hello, $name!"
```

## Pipes

Now here is where things get a very different. In PowerShell `|` is used to pipe objects from one
command to another. In bash, `|` is used to pipe the output of one command to the input of another.
That output in bash is just text, it's completely unstructured. So you can't pipe objects from one
command to another without using something like `jq` to convert the text to JSON. They syntax though
is the same:


```bash
echo "Hello, World!" | grep "World"
```

## Conclusion

There's so much more to bash than what I've covered here. There are things like redirection of outputs,
doing more advanced arithmetic, handling errors, getting input from user and more. If you want to 
know more checkout this excellent [bash guide](https://tldp.org/HOWTO/Bash-Prog-Intro-HOWTO.html#toc5)
by Mike G., or checkout the man pages for bash by running `man bash` in your terminal.

Now you have the basics, you know where to look for more information, and you can start writing your
own bash scripts. Good luck out there!
