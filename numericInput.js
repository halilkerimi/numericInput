class Binder {
    constructor(element, digits = 3, language = 'de-CH') {
        const regex = /[^0-9\.\-]/g
        this.element = element
        this.digits = digits
        this.language = language
        this.element.style.textAlign = 'right'

        if (this.element.value === undefined) {
            const temp = parseFloat(this.element.innerHTML.replace(regex, ''))
            if (isNaN(temp) || temp === Infinity || temp === Number.NEGATIVE_INFINITY) {
                return
            }
            this.element.innerHTML = temp.toLocaleString(this.language, { maximumFractionDigits: this.digits, minimumFractionDigits: this.digits })
            return
        }

        this.Value = this.Value

        const handleFocusOut = e => {
            e.preventDefault()
            const newValue = e.target.value
            const replacedText = newValue.replace(regex, '')
            const numText = parseFloat(replacedText) || 0
            e.target.value = numText.toLocaleString(language, { maximumFractionDigits: digits, minimumFractionDigits: digits })
        }

        const handleCopy = e => {
            e.preventDefault()
            const valueToCopy = parseFloat(e.target.value.replace(regex, '')) || 0
            const clipboard = e.clipboardData || window.clipboardData
            clipboard.setData('Text', valueToCopy)
        }

        const handlePaste = e => {
            e.preventDefault()
            const startPos = e.target.selectionStart
            const endPos = e.target.selectionEnd


            const clipboard = e.clipboardData || window.clipboardData
            const pastedData = clipboard.getData('Text');
            const replacedClipboardText = pastedData.replace(regex, '')

            if (e.target.value.length > 15 && startPos === endPos) {
                return
            }
            const replacedText = e.target.value.replace(regex, '')

            var lengthAgterPaste = replacedText.length + (endPos - startPos) + replacedClipboardText.length
            if (lengthAgterPaste > 15) {
                return
            }
            const newValue = e.target.value.substring(0, startPos) + replacedClipboardText + e.target.value.substring(endPos, e.target.value.length)

            const numText = parseFloat(newValue.replace(regex, '')) || 0
            e.target.value = numText.toLocaleString(language, { maximumFractionDigits: digits })
        }

        const makeItNumeric = e => {
            const startPos = e.target.selectionStart
            const endPos = e.target.selectionEnd
            if ((e.keyCode > 47 && e.keyCode < 58) || (e.keyCode > 95 && e.keyCode < 106)) { //it it is a number 

                e.preventDefault()
                if (e.target.value.length > 15 && startPos === endPos) {
                    return
                }
                const newValue = e.target.value.substring(0, startPos) + e.key + e.target.value.substring(endPos, e.target.value.length)
                const initExtraChar = (e.target.value.substring(0, startPos).match(regex) || []).length
                const replacedText = newValue.replace(regex, '')
                const numText = parseFloat(replacedText) || 0
                const decimal = newValue.split('.')[1]
                if (decimal !== undefined) {
                    e.target.value = numText.toLocaleString(language, { maximumFractionDigits: digits, minimumFractionDigits: decimal.length - 1 })
                } else {
                    e.target.value = numText.toLocaleString(language, { maximumFractionDigits: digits })
                }
                const extraChar = (e.target.value.substring(0, startPos + 1).match(regex) || []).length
                const selectION = startPos + 1 + extraChar - initExtraChar
                e.target.setSelectionRange(selectION, selectION)
                return
            } else if (e.keyCode === 8) { //it it is a backspace 
                e.preventDefault()
                const nonSelect = endPos === startPos ? 1 : 0
                const newValue = e.target.value.substring(0, startPos - nonSelect) + e.target.value.substring(endPos, e.target.value.length)
                const initExtraChar = (e.target.value.substring(0, startPos).match(regex) || []).length
                const replacedText = newValue.replace(regex, '')
                const numText = parseFloat(replacedText) || 0
                e.target.value = numText.toLocaleString(language, { maximumFractionDigits: 2 })
                const extraChar = (e.target.value.substring(0, startPos).match(regex) || []).length
                const selectION = startPos - nonSelect + extraChar - initExtraChar
                e.target.setSelectionRange(selectION, selectION)
                return
            } else if (e.keyCode === 110 || e.keyCode === 190) { //it it is a '.' 
                if ((e.target.value.length > 15 && startPos === endPos) || e.target.value.includes('.')) {
                    e.preventDefault()
                }
                return
            } else if (e.keyCode === 13 || e.keyCode === 9) {  //Enter or Tab
                const newValue = e.target.value
                const replacedText = newValue.replace(regex, '')
                const numText = parseFloat(replacedText) || 0
                e.target.value = numText.toLocaleString(language, { maximumFractionDigits: digits, minimumFractionDigits: digits })
                return
            } else if (e.keyCode > 36 && e.keyCode < 41) {  //Arrows

            } else if (e.keyCode === 109 || e.keyCode === 189) {  //negative
                e.preventDefault()
                if (e.target.value.startsWith('-')) {
                    return
                }
                const newValue = e.target.value
                const replacedText = '-' + newValue.replace(regex, '')
                const numText = parseFloat(replacedText) || 0
                e.target.value = numText.toLocaleString(language, { maximumFractionDigits: digits })
                return
            } else if (e.keyCode === 107 || (e.keyCode === 187 && e.shiftKey)) {  //positive
                e.preventDefault()
                if (!e.target.value.startsWith('-')) {
                    return
                }
                const newValue = e.target.value.substring(1)
                const replacedText = newValue.replace(regex, '')
                const numText = parseFloat(replacedText) || 0
                e.target.value = numText.toLocaleString(language, { maximumFractionDigits: digits })
                return
            } else if ((e.metaKey || e.ctrlKey) && (e.keyCode === 86 || e.keyCode === 67)) {  //Ctrl + V, Ctrl + C
                return
            }
            e.preventDefault()
        }

        this.element.addEventListener('keydown', makeItNumeric)
        this.element.addEventListener('paste', handlePaste)
        this.element.addEventListener('copy', handleCopy)
        this.element.addEventListener("focusout", handleFocusOut)
    }
    get Value() {
        const regex = /[^0-9\.\-]/g
        return parseFloat(this.element.value.replace(regex, '')) || 0
    }
    set Value(val) {
        var temp = val
        if (isNaN(val) || val === Infinity || val === Number.NEGATIVE_INFINITY) {
            temp = 0
        }
        this.element.value = temp.toLocaleString(this.language, { maximumFractionDigits: this.digits, minimumFractionDigits: this.digits })
    }
}