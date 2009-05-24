/*
 * Copyright (C) 2006 Baron Schwartz <baron at xaprb dot com>
 * Copyright (C) 2009 Titi Ala'ilima <tigre at pobox dot com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/* Set up a global Xaprb object to act as the Xaprb namespace, without colliding
 * with other Xaprb scripts.
 */
if ( typeof(Xaprb) === 'undefined' ) {
   Xaprb = new Object();
}

/* The Xaprb.InputMask object acts as the namespace for input masking
 * functionality.
 */
Xaprb.InputMask = {

   /* Each mask has a format and regex property.  The format consists
    * of spaces and non-spaces.  A space is a placeholder for a value the user
    * enters.  A non-space is a literal character that gets copied to that
    * position in the value.  The regex is used to validate each character, one
    * at a time (it is not applied against the entire value in the form field,
    * just the characters the user enters).
    *
    * The way you name your masks is significant.  If you create a mask called
    * date_us, you cause it to be applied to a form field by a) adding the
    * input_mask class to that form field, which triggers this script to treat
    * it specially, and b) adding the class mask_date_us to the form field,
    * which causes this script to apply the date_us mask to it.
    */
   masks: {
      date_iso: {
         format: '    -  -  ',
         regex:  /\d/
      },
      date_us: {
         format: '  /  /    ',
         regex:  /\d/
      },
      time: {
         format: '  :  :  ',
         regex:  /\d/
      },
      phone: {
         format: '(   )   -    ',
         regex:  /\d/
      },
      phone_dashed: {
         format: '   -   -    ',
         regex:  /\d/
      },
      ssn: {
         format: '   -  -    ',
         regex:  /\d/
      },
      visa: {
         format: '    -    -    -    ',
         regex:  /\d/
      }
   },

   /* Finds every element with class input_mask and applies masks to them.
    */
   setupElementMasks: function() {
      if ( $$ ) { // Requires the Prototype library
         $$('input.input_mask').each(function(item) {
            Event.observe(item, 'keypress',
               Xaprb.InputMask.applyMask.bindAsEventListener(item), true);
         });
      }
   },
   

   /* This is triggered when the key is pressed in the form input.  It is
    * bound to the element, so 'this' is the input element.
    */
   applyMask: function(event) {
      var match = /mask_(\w+)/.exec(this.className);
      if ( match.length == 2 && Xaprb.InputMask.masks[match[1]] ) {
         var mask = Xaprb.InputMask.masks[match[1]];
         var key  = Xaprb.InputMask.getKey(event);

         if ( Xaprb.InputMask.isPrintable(key) ) {
            var ch      = String.fromCharCode(key);
            var str     = this.value + ch;
            var pos     = str.length;
            if ( mask.regex.test(ch) && pos <= mask.format.length ) {
               // Fill in before
               if ( mask.format.charAt(pos - 1) != ' ' ) {
                  str = this.value + mask.format.charAt(pos++ - 1) + ch;
               }
	       // Fill an after
               if ( mask.format.charAt(pos) != ' ' ) {
                  str += mask.format.charAt(pos);
               }        
               this.value = str;
            }
            Event.stop(event);
         }
      }
   },

   /* Returns true if the key is a printable character.
    */
   isPrintable: function(key) {
      return ( key >= 32 && key < 127 );
   },

   /* Returns the key code associated with the event.
    */
   getKey: function(e) {
      return window.event ? window.event.keyCode
           : e            ? e.which
           :                0;
   }
};
