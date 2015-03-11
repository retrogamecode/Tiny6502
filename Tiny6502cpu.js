/*-------------------------------------------------------------------------------
* Name:        cpu6502.js
* Purpose:	   javascript 6502 processor emulator
*
* Author:      Michael Norton
*
* Created:     05/03/2015
* Copyright:   (c) Michael Norton 2015
* Licence:     <your licence>
*
* Notes:
* https://github.com/6502/js6502/blob/master/6502.js
*-------------------------------------------------------------------------------*/

// set the system memory to 8-bit with memsize of 65536 bytes
var MaxSystemMemory = 65536;
var mem8bit = new Uint8Array(MaxSystemMemory);

/*-------------------------------------------------------------------------------
*
*
*    6502 CPU Status Bit Register library
*
* notes: http://nesdev.com/6502.txt
* THE STATUS REGISTER
*
*    This register consists of eight "flags" (a flag = something that indi-
*  cates whether something has, or has not occurred). Bits of this register
*  are altered depending on the result of arithmetic and logical operations.
*  These bits are described below:
*
*     Bit No.       7   6   5   4   3   2   1   0
*                   S   V       B   D   I   Z   C
*
*   Bit0 - C - Carry flag: this holds the carry out of the most significant
*   bit in any arithmetic operation. In subtraction operations however, this
*   flag is cleared - set to 0 - if a borrow is required, set to 1 - if no
*   borrow is required. The carry flag is also used in shift and rotate
*   logical operations.
*
*   Bit1 - Z - Zero flag: this is set to 1 when any arithmetic or logical
*   operation produces a zero result, and is set to 0 if the result is
*   non-zero.
*
*   Bit 2 - I: this is an interrupt enable/disable flag. If it is set,
*   interrupts are disabled. If it is cleared, interrupts are enabled.
*
*   Bit 3 - D: this is the decimal mode status flag. When set, and an Add with
*   Carry or Subtract with Carry instruction is executed, the source values are
*   treated as valid BCD (Binary Coded Decimal, eg. 0x00-0x99 = 0-99) numbers.
*   The result generated is also a BCD number.
*
*   Bit 4 - B: this is set when a software interrupt (BRK instruction) is
*   executed.
*
*   Bit 5: not used. Supposed to be logical 1 at all times.
*
*   Bit 6 - V - Overflow flag: when an arithmetic operation produces a result
*   too large to be represented in a byte, V is set.
*
*   Bit 7 - S - Sign flag: this is set if the result of an operation is
*   negative, cleared if positive.
*
*   The most commonly used flags are C, Z, V, S.
*
*-------------------------------------------------------------------------------*/
var StatusRegister = 0;

var CBit = 0;   // Carry Flag     Bit 0
var ZBit = 1;   // Zero Flag      Bit 1
var IBit = 2;   // Interrupt Flag Bit 2
var DBit = 3;   // BCD Flag       Bit 3   - binary coded decimal
var BBit = 4;   // BRK Int Flag   Bit 4 - BRK instruction was executed
var NBit = 5;   // Not used       Bit 5 - not used, always set to 1
var VBit = 6;   // OVRFL Flag     Bit 6 - overflow flag
var SBit = 7;   // Sign flag      Bit 7 - set if result of operation is negative

/*-------------------------------------------------------------------------------
* function: SetStatusRegisterBit (bit_position)
*
* description:
*   This javascript function sets the individual bit flags 
*   in the 6502 status register emulator.
*
*   CBit = 0;   // Carry Flag     Bit 0
*   ZBit = 1;   // Zero Flag      Bit 1
*   IBit = 2;   // Interrupt Flag Bit 2
*   DBit = 3;   // BCD Flag       Bit 3   - binary coded decimal
*   BBit = 4;   // BRK Int Flag   Bit 4 - BRK instruction was executed
*   NBit = 5;   // Not used       Bit 5 - not used, always set to 1
*   VBit = 6;   // OVRFL Flag     Bit 6 - overflow flag
*   SBit = 7;   // Sign flag      Bit 7 - set if result of operation is negative
* 
* Example: Set ZBit in Status Register
*
*   SetStatusRegisterBit (Zbit);
*   ! Z-Bit SET DEBUG: 1111111100000010
*                                    ^ Zbit set
*
* Arguments:
*   bit_position: the n-th bit to set (Processor flag bit position)
* Returns:
*   None - sets member variable StatusRegister
*-------------------------------------------------------------------------------*/
function SetStatusRegisterBit(bit_position){
  StatusRegister = setbit(StatusRegister, bit_position);
}

/*-------------------------------------------------------------------------------
* function: ClearStatusRegisterBit (bit_position)
*
* description:
*   This javascript function clears the individual bit flags 
*   in the 6502 status register emulator.
*
* Example: Clear ZBit in Status Register
*
*   ClearStatusRegisterBit (Zbit);
*   ! Z-Bit CLEAR DEBUG: 1111111100000000
*                                      ^ Zbit clear
*
* Arguments:
*   bit_position: the n-th bit to set (Processor flag bit position)
* Returns:
*   None - sets member variable StatusRegister
*-------------------------------------------------------------------------------*/
function ClearStatusRegisterBit(bit_position) {
	StatusRegister = clearbit(StatusRegister, bit_position);
}

/*-------------------------------------------------------------------------------
* function: IsStatusRegisterBitSet (bit_position)
*
* description:
*   This javascript function tests to see if the individual bit flags 
*   in the 6502 status register emulator are set.
*
* Example: Test to see if ZBit in Status Register is set.
*
*   SetStatusRegisterBit (Zbit);
*   ! Z-Bit SET DEBUG: 1111111100000010
*                                    ^ Zbit set
*   bZbitSet = IsStatusRegisterBitSet(Zbit); 
*   ! Z-Bit SET? DEBUG: 1
*
*   ClearStatusRegisterBit (Zbit);
*   ! Z-Bit CLEAR DEBUG: 1111111100000000
*                                      ^ Zbit clear
*   bZbitSet = IsStatusRegisterBitSet(Zbit); 
*   ! Z-Bit SET? DEBUG: 0
*
* Arguments:
*   bit_position: the n-th bit to set (Processor flag bit position)
* Returns:
*   1 - if bit is set, ZERO otherwise
*-------------------------------------------------------------------------------*/
function IsStatusRegisterBitSet(bit_position) {
	return isBitNSet(StatusRegister, bit_position);
}

/*-------------------------------------------------------------------------------
* function: initStatusRegister ()
*
* description:
*   This javascript function initializes the individual bit flags 
*   in the 6502 status register emulator are set.
*-------------------------------------------------------------------------------*/
function initStatusRegister() {
  var radix = 2;
  var mask = parseInt("0",radix);
  var flag = 0xFF00;
  StatusRegister = flag | mask;
 }
 

/*************** TEST CODE *************/
function InitMemory () {

	// 0000: start memory 
	mem8bit[0x0] = 0xa9;
	mem8bit[0x1] = 0x0;
	mem8bit[0x2] = 0x20;
	mem8bit[0x3] = 0x10;
	mem8bit[0x4] = 0x0;
	mem8bit[0x5] = 0x4c;
	mem8bit[0x6] = 0x02;
	mem8bit[0x7] = 0x0;
	mem8bit[0x8] = 0x0;
	mem8bit[0x9] = 0x0;
	mem8bit[0xa] = 0x0;
	mem8bit[0xb] = 0x0;
	mem8bit[0xc] = 0x0;
	mem8bit[0xd] = 0x0;
	mem8bit[0xe] = 0x0;
	mem8bit[0xf] = 0x40;
	
	//0010:
	mem8bit[0x10] = 0xe8;
	mem8bit[0x11] = 0x0;
	mem8bit[0x12] = 0x20;
	mem8bit[0x13] = 0x10;
	mem8bit[0x14] = 0x0;
	mem8bit[0x15] = 0x4c;
	mem8bit[0x16] = 0x02;
	mem8bit[0x17] = 0x0;
	mem8bit[0x18] = 0x0;
	mem8bit[0x19] = 0x0;
	mem8bit[0x1a] = 0x0;
	mem8bit[0x1b] = 0x0;
	mem8bit[0x1c] = 0x0;
	mem8bit[0x1d] = 0x0;
	mem8bit[0x1e] = 0x0;
	mem8bit[0x1f] = 0x40;
	
}

function memdump() {
	
	var memdumpStr = "0000: ";
	var memvalue = "";
	for (memindex = 0; memindex < 32; memindex++) {
		memvalue = mem8bit[memindex].toString(16);
		if (memvalue == "0"){
			memvalue = "00"
		}
		memdumpStr = memdumpStr + " " + memvalue;
	}
	return memdumpStr;
}

