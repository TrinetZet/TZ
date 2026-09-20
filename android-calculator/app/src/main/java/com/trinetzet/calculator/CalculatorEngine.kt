package com.trinetzet.calculator

enum class Operation {
    ADD,
    SUBTRACT,
    MULTIPLY,
    DIVIDE,
}

sealed interface CalculationResult {
    data class Value(val number: Double) : CalculationResult

    data object DivisionByZero : CalculationResult
}

object CalculatorEngine {
    fun calculate(left: Double, right: Double, operation: Operation): CalculationResult =
        when (operation) {
            Operation.ADD -> CalculationResult.Value(left + right)
            Operation.SUBTRACT -> CalculationResult.Value(left - right)
            Operation.MULTIPLY -> CalculationResult.Value(left * right)
            Operation.DIVIDE -> {
                if (right == 0.0) {
                    CalculationResult.DivisionByZero
                } else {
                    CalculationResult.Value(left / right)
                }
            }
        }
}
