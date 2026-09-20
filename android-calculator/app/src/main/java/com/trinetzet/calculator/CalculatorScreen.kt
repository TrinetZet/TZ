package com.trinetzet.calculator

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.weight
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.Saver
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

private val CalculatorStateSaver = Saver<CalculatorState, List<String?>>(
    save = { state ->
        listOf(
            state.display,
            state.storedOperand?.toString(),
            state.pendingOperation?.name,
            state.replaceDisplay.toString(),
            state.resultShown.toString(),
        )
    },
    restore = { saved ->
        CalculatorState(
            display = saved[0].orEmpty(),
            storedOperand = saved[1]?.toDoubleOrNull(),
            pendingOperation = saved[2]?.let(Operation::valueOf),
            replaceDisplay = saved[3].toBoolean(),
            resultShown = saved[4].toBoolean(),
        )
    },
)

@Composable
fun CalculatorScreen(modifier: Modifier = Modifier) {
    var state by rememberSaveable(stateSaver = CalculatorStateSaver) {
        mutableStateOf(CalculatorState())
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.Bottom,
    ) {
        Spacer(modifier = Modifier.weight(1f))
        Text(
            text = state.display,
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 24.dp),
            color = MaterialTheme.colorScheme.onBackground,
            fontSize = if (state.display.length > 12) 32.sp else 52.sp,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
            textAlign = TextAlign.End,
        )

        CalculatorKeypad.rows.forEach { row ->
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
            ) {
                row.forEach { button ->
                    CalculatorKey(
                        button = button,
                        onClick = {
                            state = when (button) {
                                is CalculatorButton.Digit -> state.onDigit(button.value)
                                is CalculatorButton.Operator -> state.onOperation(button.operation)
                                CalculatorButton.Clear -> state.clear()
                                CalculatorButton.Equals -> state.onEquals()
                            }
                        },
                        modifier = Modifier.weight(1f),
                    )
                }
            }
            Spacer(modifier = Modifier.height(10.dp))
        }
    }
}

@Composable
private fun CalculatorKey(
    button: CalculatorButton,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val colors = when (button) {
        is CalculatorButton.Operator -> ButtonDefaults.buttonColors(
            containerColor = MaterialTheme.colorScheme.primary,
            contentColor = MaterialTheme.colorScheme.onPrimary,
        )

        CalculatorButton.Clear -> ButtonDefaults.buttonColors(
            containerColor = MaterialTheme.colorScheme.errorContainer,
            contentColor = MaterialTheme.colorScheme.onErrorContainer,
        )

        else -> ButtonDefaults.buttonColors(
            containerColor = MaterialTheme.colorScheme.secondaryContainer,
            contentColor = MaterialTheme.colorScheme.onSecondaryContainer,
        )
    }

    Button(
        onClick = onClick,
        modifier = modifier.height(68.dp),
        shape = RoundedCornerShape(22.dp),
        colors = colors,
    ) {
        Text(
            text = button.label,
            fontSize = 26.sp,
            textAlign = TextAlign.Center,
        )
    }
}
