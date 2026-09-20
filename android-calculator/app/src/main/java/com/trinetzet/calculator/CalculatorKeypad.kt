package com.trinetzet.calculator

sealed interface CalculatorButton {
    val label: String

    data class Digit(val value: Int) : CalculatorButton {
        override val label: String = value.toString()
    }

    data class Operator(
        override val label: String,
        val operation: Operation,
    ) : CalculatorButton

    data object Clear : CalculatorButton {
        override val label: String = "C"
    }

    data object Equals : CalculatorButton {
        override val label: String = "="
    }
}

object CalculatorKeypad {
    val rows: List<List<CalculatorButton>> = listOf(
        listOf(
            CalculatorButton.Digit(7),
            CalculatorButton.Digit(8),
            CalculatorButton.Digit(9),
            CalculatorButton.Operator("÷", Operation.DIVIDE),
        ),
        listOf(
            CalculatorButton.Digit(4),
            CalculatorButton.Digit(5),
            CalculatorButton.Digit(6),
            CalculatorButton.Operator("×", Operation.MULTIPLY),
        ),
        listOf(
            CalculatorButton.Digit(1),
            CalculatorButton.Digit(2),
            CalculatorButton.Digit(3),
            CalculatorButton.Operator("−", Operation.SUBTRACT),
        ),
        listOf(
            CalculatorButton.Clear,
            CalculatorButton.Digit(0),
            CalculatorButton.Equals,
            CalculatorButton.Operator("+", Operation.ADD),
        ),
    )
}
