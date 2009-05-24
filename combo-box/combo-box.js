/*
 * Copyright (C) 2004 Baron Schwartz <baron at sequent dot org>
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

var key;
var combo;

document.onkeydown = function(e) {
    if (combo && combo.editing && window.event && window.event.keyCode == 8) {
        window.event.cancelBubble = true;
        window.event.returnValue = false;
        if (combo.insertSpace) {
            combo.insertSpace = false;
        }
        else {
            with (combo.options[combo.options.length - 1]) {
                text = text.substring(0, text.length - 1);
            }
        }
    }
}

function edit(e) {
    if (window.event){
        key = window.event.keyCode;
        combo = window.event.srcElement;
        // Stop the browser from scrolling through <option>s
        window.event.cancelBubble = true;
        window.event.returnValue = false;
    }
    else if (e) {
        key = e.which;
        combo = e.target;
    }
    else {
        return true;
    }

    if (key == 13 || key == 8 || (key > 31 && key < 127)) {
        if (combo.editing && key == 13) {
            // Done editing
            combo.editing = false;
            combo = null;
            return false;
        }
        else if (!combo.editing) {
            combo.editing = true;
            combo.options[combo.options.length] = new Option("");
        }

        // Normal key
        if (key > 32 && key < 127) {
            with (combo.options[combo.options.length - 1]) {
                if (combo.insertSpace) {
                    combo.insertSpace = false;
                    text = text + " " + String.fromCharCode(key);
                }
                else {
                    text = text + String.fromCharCode(key);
                }
            }
        }
        // The backspace key
        else if (key == 8 && combo.options[combo.options.length - 1].text.length) {
            if (combo.insertSpace) {
                combo.insertSpace = false;
            }
            else {
                with (combo.options[combo.options.length - 1]) {
                    text = text.substring(0, text.length - 1);
                }
            }
        }
        // Space key requires special treatment; some browsers will not append a space
        else if (key == 32) {
            combo.insertSpace = true;
        }
        combo.selectedIndex = combo.options.length - 1;
        return false;
    }
}
