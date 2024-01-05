---
title: My Journey to Neovim
pubDate: '2024-01-04T11:20:03.284Z'
description: 'How and why I switched to Neovim'
layout: '../../layouts/BlogPost.astro'
---

## Long Long Ago...

Once upon a time, back when I was a young lad, I was exploring this weird thing called Linux. I had
wanted to try something different from the standard Windows experience. I wanted to be a developer
and create applications, and everyone said Linux was better for development, so Step 1 was learning
how to Linux right? It just so happens that the version of Linux I was using, came with an arcane
relic from the past called vim, or vi for short. Launching it seemed to lead to a daunting realm that
had me unable to exit. I could see text on screen and as I mashed keys incessantly I saw my cursor
move around, modes seemed to change from insert to normal... but alas, I could not exit the editor.
I didn't know the correct incantation to release me from this fresh vim hell. I was trapped in vim.

Fast forward 20 minutes of key mashing, I ended up restarting my terminal entirely and moving on with
my exploration. Learning (read fumbling) about the system and getting an idea of what this Linux thing was
all about. Over the years it kept coming for me. Git seemed to think it needed to be the default editor
for commit message editing. Distributions didn't ship with my new friend nano by default. But I kept
my distance. I used nano, and over time forgot about that weird little realm called vim.

After a while, I started learning how to actually write code. In college I moved through using all
manner of editors. Adobe Brackets, Visual Studio, JGrasp, Eclipse, and IntelliJ. Eventually, I had
a system. If I was writing C#, then use Visual Studio. If I was writing literally anything else, use
VS Code. This ended up serving me well in both my hobby projects and the beginnings of my career.
I was making things, I was happy, and someone was even paying me to do it!

## It's Following Me

This vim thing just wouldn't go away though. It kept coming up. It was the default in server environments.
CLI tools beligerently dropped me into vim land without asking me first. So begrudgingly, I learned 
2 things. The first was how to exit vim. Then the next was how to actually save a file in vim. I 
still could barely move around my cursor. I didn't know the difference between normal and insert mode.
I was still just fumbling around in this strange realm, but it wasn't quite as dark and dreadful as 
it was before. At least until I forgot all of this and inevitably had to look it all up again in 3 
months. That happened a lot.

Then something strange started to happen at work. I started to feel... slow. I needed to jump to code
just over there and had to reach for the mouse. Eventually I learned to use the Home and End keys
on my keyboard. I learned you could hold Control and jump between words with the arrow keys. This
helped, but I had this feeling in my gut that there might be a better way. After some thinking, I
went back to the strange land called vim. I tried vimtutor. It felt wrong. The theory behind it all
seemed good, but something was off. What in the world am I supposed to do with h, j, k, and l? Arrows
are supposed to be arranged in a stack of three on the bottom and the up arrow above... how could
this possibly be better? I had this repeat about yearly, until eventually I just stopped trying.
I couldn't learn vim. I was defeated.

## Change

But then something else happened. I fractured my elbow. I was completely unable to type with two hands for
a week, and was highly limited for quite a bit longer. I had two keyboards positioned on my desk (a poor man's split keyboard)
to try to still write code, even while in a cast, but eventually I knew I needed another option. I
knew that I would heal and get better, but I also knew that things happen in life, and if I lost my
ability to type permanently I'd need something to fall back on. Talon voice software was the answer.
I learned the incantations, but little did I know that learning to type with my voice, was also teaching
me something else: motions. Different prefixes and qualifiers did different things. I could jump
lines and manipulate text faster than ever before, and once I was healed up, I found myself again with
that sinking feeling that the normal way of editing text, while intuitive for most people, maybe
wasn't ideal. I continued this way for a few months, stewing and thinking. Vim started popping into
my head, the theory was the same as Talon. Motions make things easier. The theory was the same as
writing code. If you do something a lot, then you should automate it. Motions are just macros for
doing common tasks within your editor.

A strange man entered the scene. He was brash, enthusiastic and had a penchant for going against the grain.
He was [ThePrimeagen](https://twitter.com/ThePrimeagen). It all started with appearances on podcasts.
He talked of things I had properly dismissed before. Devorak, vim, and what the heck was a Kinesis
anyway? I wanted to learn more, so down the YouTube rabbit hole I went. Sifting through videos and
watching his zero to LSP config video had my mind reeling. Watching him navigate code was magic.
I was curious, and I was interested. Maybe there was something to this Neovim thing he was talking
about. Maybe this was the better way I had been looking for.

## Enlightenment

It started with just vim motions in my editors. VS Code got the Neovim plugin and Visual Studio got
the vsvim extension. Something began to click and the muscle memory started developing. Slowly
these environments started to look more and more like what I had seen in the YouTube videos and
streams, but I still had to reach for the mouse. A lot. It felt more productive, but it wasn't as
productive as it could be.

Fast forward a few weeks. I had a new obsession. I had taken the leap and was down the rabbit hole.
I was determined to make Neovim my IDE, and I am proud to say as of right now, I've largely
succeeded. I feel so much more knowledgeable about not only how to edit things in a better, faster
way, I also have a deeper understanding about how editors and IDEs work. I now have an understanding 
of how LSPs and plugins all work together to make an environment that I can write and debug code in.
All from my terminal, and all configured exactly as I wished it to be. It wasn't smooth sailing, 
there were many challenges, but I found myself falling in love with programming all over again. 
The mountains I had to climb were worth it. I had come out the other side, and I started actually
building things again.

## Conclusion. Sort of.

I'm still on this journey. I'm still getting faster at coding and learning new motions and features
in Neovim. I've had to rewrite my config twice now, but each time I do, instead of feeling annoyed
I find myself feeling like I'm making progress. I feel like I'm slowly becoming a better and better
developer. I feel like my skills are improving and for the first time in a while, I feel like there's more to
learn and explore than ever before. I've also found a bit more confidence. If I can learn Neovim,
then maybe I can do other things that have intimidated me in the past. Things like learning C and Rust
aren't maybe as out of reach as I once thought. I can still learn and grow. Do I think everyone 
should learn to use Neovim? No. I think you need to be in a certain place to accept it and to take
it and run with it. But once you stick to the path, the journey and the destination both will lead
you to become a next level developer. 
