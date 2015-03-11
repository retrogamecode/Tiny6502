/*-------------------------------------------------------------------------------
* Name:        Tiny6502AddressBus.js
* Purpose:	   javascript 6502 processor address bus emulator library 
*              
*              This library handles the software emulation of the 
*              6502 processor address bus. 
*              Pins 9 - 20, correlating to A0-A11, and pins 22 - 25,
*              for A12-A15.
*
*              This library specifically handles the high and low states
*              of the address bus A0-A15.
*
* Author:      Michael Norton
*
* Created:     03/08/2015
* Copyright:   (c) Michael Norton 2015
* Licence:     <your licence>
*
* Notes:
* 
*-------------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------------
*
*
*    6502 CPU Address Bits library
*
*     Physical Address Line   Maps to  Virtual AddressBus
*
*             +--+                               +--+
*             |  | A0 ---------------->A0 = bit 0|  |
*             +--+                               +--+
*             |  | A1 ---------------->A1 = bit 1|  |
*             +--+                               +--+
*             |  | A2 ---------------->A2 = bit 2|  |
*             +--+                               +--+
*             |  | A3 ---------------->A3 = bit 3|  |
*             +--+                               +--+
*             |  | A4 ---------------->A4 = bit 4|  |
*             +--+                               +--+
*             |  | A5 ---------------->A5 = bit 5|  |
*             +--+                               +--+
*             |  | A6 ---------------->A6 = bit 6|  |
*             +--+                               +--+
*             |  | A7 ---------------->A7 = bit 7|  |
*             +--+                               +--+

*               :                                  :       
*             +--+                               +--+
*             |  | A13 ------------->A13 = bit 13|  |
*             +--+                               +--+
*             |  | A14 ------------->A14 = bit 14|  |
*             +--+                               +--+
*             |  | A15 ------------->A15 = bit 15|  |
*             +--+                               +--+
*-------------------------------------------------------------------------------*/

var AddrBus = 0;        // Addr holds all 16 bit states of A0-A15 
var A0 = 0;             // Bit 0 in AddrBus represents state for A0    
var A1 = 1;             // Bit 1 in AddrBus represents state for A1    
var A2 = 2;             // Bit 2 in AddrBus represents state for A2    
var A3 = 3;             // Bit 3 in AddrBus represents state for A3    
var A4 = 4;             // Bit 4 in AddrBus represents state for A4    
var A5 = 5;             // Bit 5 in AddrBus represents state for A5    
var A6 = 6;             // Bit 6 in AddrBus represents state for A6    
var A7 = 7;             // Bit 7 in AddrBus represents state for A7    
var A8 = 8;             // Bit 8 in AddrBus represents state for A8    
var A9 = 9;             // Bit 9 in AddrBus represents state for A9    
var A10 = 10;           // Bit 10 in AddrBus represents state for A10    
var A11 = 11;           // Bit 11 in AddrBus represents state for A11    
var A12 = 12;           // Bit 12 in AddrBus represents state for A12    
var A13 = 13;           // Bit 13 in AddrBus represents state for A13    
var A14 = 14;           // Bit 14 in AddrBus represents state for A14    
var A15 = 15;           // Bit 15 in AddrBus represents state for A15

/*-------------------------------------------------------------------------------
* function: initStatusRegister ()
*
* description:
*   This javascript function initializes the individual bit flags 
*   in the 6502 status register emulator are set.
*-------------------------------------------------------------------------------*/
function initAddressBus() {
  var radix = 2;
  var mask = parseInt("0",radix);
  var flag = 0x1000;
  AddrBus = flag | mask;
 }   

function SetAddressBusBit(bit_position){
  AddrBus = setbit(AddrBus, bit_position);
} 

function ClearAddressBusBit(bit_position) {
	AddrBus = clearbit(AddrBus, bit_position);
}

/*
http://www.atariarchives.org/roots/chapter_2.php

 Since all Atari computers are 8-bit computers (
 at this writing, anyway), the only way to store a 
 16-bit number in an Atari is to put it into two 
 memory registers. And 6502-based computers use the 
 odd (to some people) convention of storing 16-bit 
 numbers with the lower (least significant) byte 
 first and the higher (most significant) byte second. 
 For example, if the hexadecimal number FC1C were 
 stored in hexadecimal memory address 0600 and 0601, 
 FC (most significant byte) would be stored in address 0601, 
 and 1C (the least significant byte) would be stored in 
 address 0600. (In assembly language programs, incidentally, 
 hexadecimal numbers are usually preceded with dollars signs 
 so that they can be distinguished from decimal numbers. 
 The hexadecimal addresses 0600 and 0601, therefore, would 
 ordinarily be written $0600 and $0601 in an assembly 
 language program.

 Poke
30 LET X = 12000
40 LET HIBYTE=INT(X/256)
50 LET LOBYTE=X-HIBYTE*256
60 POKE 1536,LOBYTE
70 POKE 1537,HIBYTE

Peek
10 LET X=PEEK(1537)*256+PEEK(1536)
20 PRINT X
> 120000

http://www.thealmightyguru.com/Games/Hacking/Wiki/index.php?title=Little-endian

The 6502 that powers the Nintendo stores its memory in 
Little-Endian rather than big-endian. This affects the 
stored order of multiple-byte values in the processor. 
The difference between the two can be seen in the table below:

Hex Value	2-Byte Value
Little-Endian	$1000	00 10
Big-Endian	$1000	10 00

The 6502 has no native support for 2-byte integers, so its 
endianness doesn't apply to them, but memory addresses are 
often stored as 2-bytes. Thankfully, compilers of 6502 assembly 
don't require you to input memory addresses in little-endian.
Instead, they swap the two bytes for you when a program is compiled.

However, if you're reading 6502 machine code from a debugger or from 
the ROM, the memory addresses will be stored in little-endian. 
For example, if you wanted to load memory from address $1000 using 
assembly, the code would look like this:

LDA $1000          ; Loads A with whatever value is in $1000.

However, if you open the compiled machine code in a hex editor, 
it will look like this:

AD 00 10      

Notice how the low and high bytes of the memory address are swapped 
by the compiler due to the 6502 using little-endian.

http://wilsonminesco.com/6502primer/MemMapReqs.html

LDA $684A,X

In big endian form,
Lowbyte = 4A
Highbyte = 68

In little endian form,

Lowbyte = 68
Highbyte = 4a
*/
function setAddressLittleEndian(memAddr){
	AddrBus =  ((memAddr & 0xFF) << 8)
           | ((memAddr >> 8) & 0xFF);
}


/*-------------------------------------------------------------------------------
*
*                       Address Bus Emulator Hi-Low Byte Mapping
*                       
*                      AddrBus8bit[AddrBusLowByte] 
*                      
*                         0  1  2  3  4  5  6  7
*                      +--+--+--+--+--+--+--+--+
*                      |  |  |  |  |  |  |  |  |
*                      +--+--+--+--+--+--+--+--+
*                         ^  ^  ^  ^  ^  ^  ^  ^
*             +--+        |  |  |  |  |  |  |  | 
*             |  | A0 --  +  |  |  |  |  |  |  |
*   6502      +--+           |  |  |  |  |  |  |
*             |  | A1 -------+  |  |  |  |  |  |
*   Address   +--+              |  |  |  |  |  | 
*             |  | A2 ----------+  |  |  |  |  |
*   Low       +--+                 |  |  |  |  |
*             |  | A3 -------------+  |  |  |  |
*             +--+                    |  |  |  |
*             |  | A4 ----------------+  |  |  |
*             +--+                       |  |  | 
*             |  | A5 -------------------+  |  |
*             +--+                          |  | 
*             |  | A6 ----------------------+  |
*             +--+                             |
*             |  | A7 -------------------------+
*             +--+                               
-------------------------------------------------------------------------------*/
var MaxWordSize = 2;                           // word size = 2 8-bit words
var AddrBusLowByte = 0;                        // low byte little endian
var AddrBusHighByte = 1;                       // high byte little endian
var AddrBus8bit = new Uint8Array(MaxWordSize); // emulate the address bus

function setAddrBus8BitLittleEndian(memAddr) {
	
	AddrBus8bit[AddrBusHighByte] = (memAddr & 0xFF);   // grab the low byte of word
	AddrBus8bit[AddrBusLowByte] = (memAddr >> 8) & 0xFF;
}

function debugAddr8Bit() {
	return "Little endian memAddr("+ memAddr.toString(16) +"): " +  AddrBus8bit[AddrBusHighByte].toString(16) + AddrBus8bit[AddrBusLowByte].toString(16);
}
