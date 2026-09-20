package com.trinetzet.calculator

data class CalculatorState(
    val display: String = "0",
    val storedOperand: Double? = null,
    val pendingOperation: Operation? = null,
    val replaceDisplay: Boolean = false,
    val resultShown: Boolean = false,
) {
    fun onDigit(digit: Int): CalculatorState {
        require(digit in 0..9) { "Digit must be between 0 and 9" }

        if (resultShown) {
            return CalculatorState(display = digit.toString())
        }

        val nextDisplay = when {
            replaceDisplay -> digit.toString()
            display == "0" -> digit.toString()
            else -> display + digit
        }

        return copy(display = nextDisplay, replaceDisplay = false)
    }

    fun onOperation(operation: Operation): CalculatorState {
        if (display == DIVISION_BY_ZERO_MESSAGE) {
            return this
        }

        if (pendingOperation != null && replaceDisplay) {
            return copy(pendingOperation = operation)
        }

        return copy(
            storedOperand = display.toDouble(),
            pendingOperation = operation,
            replaceDisplay = true,
            resultShown = false,
        )
    }

    fun onEquals(): CalculatorState {
        val left = storedOperand ?: return this
        val operation = pendingOperation ?: return this
        if (replaceDisplay) return this

        return when (val result = CalculatorEngine.calculate(left, display.toDouble(), operation)) {
            is CalculationResult.Value -> CalculatorState(
                display = formatNumber(result.number),
                resultShown = true,
            )

            CalculationResult.DivisionByZero -> CalculatorState(
                display = DIVISION_BY_ZERO_MESSAGE,
                resultShown = true,
            )
        }
    }

    fun clear(): CalculatorState = CalculatorState()

    private fun formatNumber(number: Double): String =
        if (number % 1.0 == 0.0) number.toLong().toString() else number.toString()

    private companion object {
        const val DIVISION_BY_ZERO_MESSAGE = "Нельзя делить на ноль"
    }
}
