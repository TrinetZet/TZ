package com.trinetzet.calculator

import org.junit.Assert.assertEquals
import org.junit.Test

class CalculatorKeypadTest {
    @Test
    fun containsExpectedFourByFourLayout() {
        assertEquals(
            listOf(
                listOf("7", "8", "9", "÷"),
                listOf("4", "5", "6", "×"),
                listOf("1", "2", "3", "−"),
                listOf("C", "0", "=", "+"),
            ),
            CalculatorKeypad.rows.map { row -> row.map(CalculatorButton::label) },
        )
    }

    @Test
    fun operatorButtonsMapToEngineOperations() {
        val operations = CalculatorKeypad.rows
            .flatten()
            .filterIsInstance<CalculatorButton.Operator>()
            .associate { it.label to it.operation }

        assertEquals(Operation.ADD, operations["+"])
        assertEquals(Operation.SUBTRACT, operations["−"])
        assertEquals(Operation.MULTIPLY, operations["×"])
        assertEquals(Operation.DIVIDE, operations["÷"])
    }
}
