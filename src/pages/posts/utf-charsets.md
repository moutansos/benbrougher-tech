---
title: ASCII vs UTF-8 vs UTF-16 vs UTF-32
pubDate: '2023-03-24T18:28:22.233Z'
updated: '2023-06-13T00:00:00.000Z'
description: What are all the different ASCII and UTF-x encodings and why do they matter?
layout: '../../layouts/BlogPost.astro'
---

If you've done any amount of coding or just looked at text files, you might have noticed down in the corner of the text editor a small thing that says "UTF-8" and you may have wondered what that means. That is the encoding standard for the currently open text file. It tells the editor how the bits and bytes of your current file are supposed to be laid out. Different encodings have different advantages and disadvantages, and to go over why we have so many different kinds, we are going to have to go back in time, to the 1980s. A time when there was an explosion of different types of computer systems.

There were many different types of computers in the '80s and '90s. Many of which had their own way of storing letters numbers and symbols. For example:

- Commodore 64 used [PETSCII](https://en.wikipedia.org/wiki/PETSCII) an in-house character set used originally for the Commodore PET
- Atari 8-bit computers used [ATASCII](https://en.wikipedia.org/wiki/ATASCII)
- Early Mac OS computers used the [Mac OS Roman](https://en.wikipedia.org/wiki/Mac_OS_Roman) character set
- The TRS-80 used an [ASCII Derivative](https://en.wikipedia.org/wiki/TRS-80_character_set#:~:text=The%20TRS%2D80%20computer%20manufacturered,with%20a%20lower%2Dcase%20upgrade.)
- DEC mainframes like the PDP-11 and VAX mainframes used the [RADIX 50](https://en.wikipedia.org/wiki/DEC_RADIX_50) character set
- IBM z/OS on mainframes used a character set called [EBCDI](https://www.ibm.com/docs/en/zos-basic-skills?topic=mainframe-ebcdic-character-set)
- IBM PC's used an ASCII derivative called ["extended ASCII"](https://en.wikipedia.org/wiki/Extended_ASCII)

Believe it or not, these are only the encodings supporting English-style characters, if we pull Central European, Asian and Hebrew into the mix, things get even more complicated. All these standards were codified in the pre-internet days, so inter-compatibility wasn't as high of a priority, but slowly the world became more and more connected, leading to a need for a unifying standard. In the wake of this, one standard started to rise in popularity due to the proliferation of the IBM PC and its derivatives, and that was ASCII.

## ASCII

ASCII stands for the American Standard Code for Information. The first edition was developed in 1963 and was derived from [telegraph code](https://en.wikipedia.org/wiki/Telegraph_code). Later telegraphs started having fixed lengths such as the Baudot code which was five bits in length. This consistency enabled machines to read and write characters rather than telegraph operators needing to know all the codes for all the characters. This paved the way for ASCII. Indeed the first usage of ASCII was in AT&T's TWX network. Over time various computer systems adopted and adapted the standard. Some minor revisions happened over the years as well, but fast forward to the early 2000s and ASCII became the most common character encoding on the internet.
  
### ASCII's Physical Layout

Each ASCII character is 8 bits wide, or one byte. Standard ASCII only uses 7 of those bits to encode information. The result of this means that if each bit is either a 1 or a 0 that there are only 128 possible characters. In practice, only 95 of those characters are used. The rest are reserved for control characters, for example, patterns like `000 0100` represented "End of Transmission", `000 0110` represented "Acknowledgment", and `000 0111` represents the machine ringing a physical bell.  
  
The easiest way to conceptualize these binary characters is with decimal numbers. For example, `000 0100` can represent the number 4. If you want to learn more about converting between decimal and binary you can take a look [here](https://www.electronics-tutorials.ws/binary/bin_2.html). Looking at a table of all the ASCII characters, numbers (unintuitively) start at 48 and go through 57, and capital and lowercase letters run 65-90 and 97-122 respectively. In addition, there are a handful of symbols supported by the encoding set.

### Problems with ASCII

ASCII was great, but only for English speakers as there were no foreign characters available, and also there were only 8 bits to store information, limiting the ability to add other types of characters. With the world becoming more and more connected, many wished to use the internet in their native language. Using different character sets was the original solution for this, but systems needed to be inter-compatible even across language barriers. If a website had an option for changing the language, it was unreasonable to use different encodings for all the different languages and character sets. The world needed a single unified standard to move forward. 

## Unicode

Enter, the Unicode standard, also known as UCS. The first draft of Unicode was released by the International Organization for Standardization or ISO in 1989. The goal was to unify all printable characters in all languages into a single character set. It consists of different elements called groups, planes rows and cells. There are:

- 128 groups of
- 256 planes of
- 256 rows of
- 256 cells 

This yields a total of 2,147,483,648 possible printed characters, but not all of those were used in the original specification and even today not all of those possible characters are used.

Upon initial release, there were three different ways that you could encode these characters

1. UCS-2 which was two bytes representing every character, which cover part of the Unicode standard
2. UCS-4 which was 4 bytes for every character, allowing for encoding of all possible characters at the time
3. UTF-1 which was a variable-length encoding. From 1 to 5 bytes

UCS-2 and UCS-4 were both simple to implement, but UCS-2 could only encode part of the specification, and UCS-4 wasted much space and still wouldn't cover all possible characters in future iterations of the Unicode specification. UTF-1 was much more complex to implement, but it saved space in practice, only requiring however many bytes were needed to encode the applicable characters. It was very complex to implement at the time though and didn't see much adoption.
  
Over time, the need for more characters available to the standard grew, and out of this need the UTF-8, UTF-16 and UTF-32 standards were all born

### UTF-8

UTF-8 was originally developed for an OS built by Bell Labs called [Plan 9](https://en.wikipedia.org/wiki/Plan_9_from_Bell_Labs) in 1992. It was officially added to the Unicode 2.0 standard in 1996. It is a variable length encoding so it can be anywhere from 1 to 4 bytes. It is backward compatible with ASCII since the first byte is the same as the ASCII standard, all subsequent bytes extend the number of characters that it's capable of having. It's very efficient over the wire and on disk as it doesn't use bytes it doesn't need. 
  
Today, UTF-8 is the default choice for text encoding. Most data, including the markdown file in this blog post, and the HTML being sent to your browser right now is all UTF-8. It's more efficient to send in most scenarios than the other formats and it's very efficient to implement (albeit a bit complex compared to other standards).

Physically, this is how UTF-8 characters can be laid out in memory or on disk. The length is variable between 1 and 4 bytes:

```
|      Byte 1      |    Byte 2     |    Byte 3     |    Byte 4     |
|------------------|---------------|---------------|---------------|
| ASCII Component  |               |               |               |
| ASCII Component  | Extended Byte |               |               |
| ASCII Component  | Extended Byte | Extended Byte |               |
| ASCII Component  | Extended Byte | Extended Byte | Extended Byte |
```

### UTF-16

UTF-16 was introduced in the Unicode 2.0 standard as well. It is a variable length encoding, however, it uses two chunks of 2 bytes, instead of 4 individual bytes in UTF-8. This means that it contains much more whitespace compared to UTF-8. It's derived from the UCS-2 standard. Early on after the introduction of Unicode 1.0, operating systems like Windows and programming languages like Java tried to implement the 16-bit character set of UCS-2. This meant that the systems would have no compatibility path to UTF-8 since the smallest possible encoding was smaller than the minimum in UCS-2. This led to the need to create UTF-16 as a standard to be backward compatible with UCS-2 while still supporting the new characters being added to the Unicode standard. 
  
Today, you might run across UTF-16 when dealing with Windows systems, and early versions of PowerShell. Much of the Windows API is based on the UTF-16 character set. Java and JavaScript also were early adopters of the UCS-2 standard and therefore now are UTF-16-based.

The physical layout of UTF-16 usually looks like this:

```
|     Byte 1      |     Byte 2     |    Byte 3     |    Byte 4     |
|-----------------|----------------|---------------|---------------|
| Base Component  | Base Component |               |               |
| Base Component  | Base Component | Extended Byte | Extended Byte |
```

### UTF-32

UTF-32 was brought into being (in name mostly) in 2003. It is the only fixed-length encoding introduced as part of that standard and as the name implies it's 4 bytes of data encoded into 32 bits. Like UCS-2 and the need for a forward progression, UCS-4 also needed a new name along with the rest of the Unicode standard (some minor tweaks came with the name change as well). It covers the same possible space of characters as the other two, but it has drastically more whitespace. It is much easier to implement algorithmically, but often the savings in development and performance overhead doesn't outweigh the space and bandwidth costs of using it in practice. Due to this, it's only used in very specific applications.

UTF-32 is usually used by applications internally when performance can be an issue and memory and space are not as much of a concern. Its usage is pretty much non-existent, and while the number is bigger, it isn't the better choice most of the time.

## Conclusion

Hopefully, now you know why we have all these different standards and what they mean for you in day to day development. UTF-8 is the go-to and often the default choice. The others are provided for backward compatibility with the original UCS standards and some very specific performance-oriented scenarios. If you found this interesting, maybe check out the [Unicode Explorer](https://unicode-explorer.com/blocks) and take a look at all the different ranges of blocks in the spec. Even ancient languages such as the cryptic Cypro-Minoan language and Phonecian are valid Unicode characters.