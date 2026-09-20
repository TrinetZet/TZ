package com.trinetzet.calculator

import org.junit.Assert.assertEquals
import org.junit.Test

class CalculatorEngineTest {
    @Test
    fun addsNumbers() {
        assertEquals(
            CalculationResult.Value(7.0),
            CalculatorEngine.calculate(5.0, 2.0, Operation.ADD),
        )
    }

    @Test
    fun subtractsNumbers() {
        assertEquals(
            CalculationResult.Value(3.0),
            CalculatorEngine.calculate(5.0, 2.0, Operation.SUBTRACT),
        )
    }

    @Test
    fun multipliesNumbers() {
        assertEquals(
            CalculationResult.Value(10.0),
            CalculatorEngine.calculate(5.0, 2.0, Operation.MULTIPLY),
        )
    }

    @Test
    fun dividesNumbers() {
        assertEquals(
            CalculationResult.Value(2.5),
            CalculatorEngine.calculate(5.0, 2.0, Operation.DIVIDE),
        )
    }

    @Test
    fun rejectsDivisionByZero() {
        assertEquals(
            CalculationResult.DivisionByZero,
            CalculatorEngine.calculate(5.0, 0.0, Operation.DIVIDE),
        )
    }
}
