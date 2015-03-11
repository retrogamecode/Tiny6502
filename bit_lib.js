/*-------------------------------------------------------------------------------
* Name:        bit_lib.js
* Purpose:	   javascript bit operator tools
*
* Author:      Michael Norton
*
* Created:     05/03/2015
* Copyright:   (c) Michael Norton 2015
* Licence:     <your licence>
*
* Notes:
*              Code based on bit hacks discussion at:
*   http://www.catonmat.net/blog/low-level-bit-hacks-you-absolutely-must-know/
*
*-------------------------------------------------------------------------------*/


/*-------------------------------------------------------------------------------
* function: setbit (bitstring, bitposition)
*
* description:
*   This javascript function sets the individual bit in a bitstring at
*   at bitposition in the bitstring.
*
* Example: Set bit position 2 in bit string 01111000
*
*     01111000    (120 in binary)     argument: bitstring = 01111000
*   | 00000100    (1<<2)              argument: bitposition = 2
*     --------
*     01111100                        returns: this value
*
* Arguments:
*   bitstring: the binary representation of the bits to be modified 
*   bitposition: the n-th bit to set
*-------------------------------------------------------------------------------*/
function setbit(bitstring, bitposition) {
  // set bit
  // num | (1<<bit);
  return bitstring | (1<<bitposition);
} 

/*-------------------------------------------------------------------------------
* function: clearbit (bitstring, bitposition)
*
* description:
*   This javascript function clears the individual bit in a bitstring at
*   at bitposition in the bitstring.
*
* Example: Clear bit position 4 in bit string 01111111
*
*     01111111    (127 in binary)     argument: bitstring = 01111111
*   & 11101111    (~(1<<4))           argument: bitposition = 4
*     --------
*     01101111                        returns: this value
*
* Arguments:
*   bitstring: the bit string to be modified 
*   bitposition: the n-th bit to set
*-------------------------------------------------------------------------------*/
function clearbit(bitstring, bitposition) {
  // unset bits
  // num & ~(1<<bit);
  return bitstring & ~(1<<bitposition);
} 

/*-------------------------------------------------------------------------------
* function: isBitNSet (bitstring, bitposition)
*
* description:
*   This javascript function clears the individual bit in a bitstring at
*   at bitposition in the bitstring.
*
* Example: Test to see if bit position 0 in bit string 01100010 is set
*
*      01100010   (98 in binary)  argument: bitstring = 01100010
*  &   00000001                   argument: bitposition = 0
*      --------
*      00000000                
*
*   if (bitstring & (1<<bitposition)) {
*    n-th bit position is set
*   }
*   else {
*     n-th bit position is not set
*   }
*
* Arguments:
*   bitstring: the bit string to be modified 
*   bitposition: the n-th bit to set
*
* Returns:
*    1 - if bit at bitposition is set. ZERO otherwise
*-------------------------------------------------------------------------------*/
function isBitNSet(bitstring, bitposition) {
  if ( bitstring & (1<<bitposition) ) {
	  return 1;
  } 
  // bit not set return FALSE!
  return 0;
} 
