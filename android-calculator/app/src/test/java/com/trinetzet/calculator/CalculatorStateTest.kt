package com.trinetzet.calculator

import org.junit.Assert.assertEquals
import org.junit.Test

class CalculatorStateTest {
    @Test
    fun entersMultipleDigits() {
        assertEquals("12", CalculatorState().onDigit(1).onDigit(2).display)
    }

    @Test
    fun replacesLeadingZero() {
        assertEquals("7", CalculatorState().onDigit(0).onDigit(7).display)
    }

    @Test
    fun latestOperatorReplacesPendingOperator() {
        val state = CalculatorState()
            .onDigit(8)
            .onOperation(Operation.ADD)
            .onOperation(Operation.MULTIPLY)

        assertEquals("8", state.display)
        assertEquals("16", state.onDigit(2).onEquals().display)
    }

    @Test
    fun equalsWithoutSecondOperandKeepsDisplayStable() {
        assertEquals("9", CalculatorState().onDigit(9).onEquals().display)
    }

    @Test
    fun completesAdditionFlow() {
        val result = CalculatorState()
            .onDigit(1)
            .onDigit(2)
            .onOperation(Operation.ADD)
            .onDigit(3)
            .onEquals()

        assertEquals("15", result.display)
    }

    @Test
    fun showsDivisionByZeroMessage() {
        val result = CalculatorState()
            .onDigit(8)
            .onOperation(Operation.DIVIDE)
            .onDigit(0)
            .onEquals()

        assertEquals("Нельзя делить на ноль", result.display)
    }

    @Test
    fun clearRecoversFromDivisionByZero() {
        val recovered = CalculatorState()
            .onDigit(8)
            .onOperation(Operation.DIVIDE)
            .onDigit(0)
            .onEquals()
            .clear()

        assertEquals(CalculatorState(), recovered)
    }

    @Test
    fun digitAfterResultStartsFreshCalculation() {
        val result = CalculatorState()
            .onDigit(1)
            .onOperation(Operation.ADD)
            .onDigit(2)
            .onEquals()
            .onDigit(4)

        assertEquals("4", result.display)
    }

    @Test(expected = IllegalArgumentException::class)
    fun rejectsDigitsOutsideKeypadRange() {
        CalculatorState().onDigit(10)
    }
}
