import React, { useState, useEffect } from 'react';
import style from './App.module.scss';
import food_data from '@data/food_densities.json';
import measurement_data from '@data/measurement_to_grams.json';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import type { TextFieldProps } from '@material-ui/core/TextField';
import { Typography } from '@material-ui/core';

interface AppProps {}

type FoodData = typeof food_data[number];
type MeasurementData = typeof measurement_data[number];

console.log('Styling', style);

function App({}: AppProps) {
  const [selectedFoodItem, setSelectedFoodItem] = useState<
    FoodData | undefined | null
  >(null);
  const [inputAmount, setInputAmount] = useState<string>('1');
  const [inputUnit, setInputUnit] = useState<
    MeasurementData | undefined | null
  >(null);
  const [outputUnit, setOutputUnit] = useState<
    MeasurementData | undefined | null
  >(null);

  let outputAmount = null;
  const itemQuantity = parseFloat(inputAmount);
  if (
    selectedFoodItem != null &&
    inputUnit != null &&
    !Number.isNaN(itemQuantity) &&
    outputUnit != null
  ) {
    outputAmount = calculate({
      inputUnitConversionFactor: inputUnit.value,
      outputUnitConversionFactor: outputUnit.value,
      itemDensity: selectedFoodItem.density,
      itemQuantity,
    });
  }

  return (
    <div className={style.mainLayout}>
      <div className={cx(style.headerRow, style.fullBleed)}>
        <Typography variant="h2">
          Cooking Measurement Conversionator 2000
        </Typography>
      </div>
      <div className={style.App}>
        <div className={style.foodInputBox}>
          <Autocomplete
            options={food_data}
            getOptionLabel={(x: FoodData) => x.item}
            onChange={(e, value) => {
              setSelectedFoodItem(value);
            }}
            renderInput={(params: any) => (
              <TextField {...params} label="Item" required />
            )}
          />
        </div>
        <div className={style.inputAmountBox}>
          <TextField
            label="Input Amount"
            type="number"
            inputProps={{
              min: 0,
            }}
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            required
          />
        </div>
        <div className={style.inputUnitBox}>
          <Autocomplete
            options={measurement_data}
            getOptionLabel={(x) => x.unit}
            onChange={(e, value) => {
              setInputUnit(value);
            }}
            renderInput={(params: TextFieldProps) => (
              <TextField {...params} label="Input Unit" required />
            )}
          />
        </div>
        <div className={style.outputAmountBox}>
          <Typography variant="h6" component="span">
            Ouput:{' '}
          </Typography>
          <Typography variant="body1" component="span">
            {outputAmount != null ? outputAmount.toFixed(3) : 'N/A'}
          </Typography>
        </div>
        <div className={style.outputUnitBox}>
          <Autocomplete
            options={measurement_data}
            getOptionLabel={(x) => x.unit}
            onChange={(e, value) => {
              setOutputUnit(value);
            }}
            renderInput={(params: any) => (
              <TextField {...params} label="Output Unit" required />
            )}
          />
        </div>
      </div>
    </div>
  );
}

function calculate({
  inputUnitConversionFactor,
  outputUnitConversionFactor,
  itemDensity,
  itemQuantity,
}: {
  inputUnitConversionFactor: number;
  outputUnitConversionFactor: number;
  itemDensity: number;
  itemQuantity: number;
}): number {
  const amountInGrams =
    inputUnitConversionFactor > 0
      ? itemQuantity * inputUnitConversionFactor
      : itemQuantity * -inputUnitConversionFactor * itemDensity;
  const result =
    outputUnitConversionFactor > 0
      ? amountInGrams / outputUnitConversionFactor
      : amountInGrams / itemDensity / -outputUnitConversionFactor;
  return result;
}

function cx(
  ...classnames: Array<string | null | undefined | Record<string, boolean>>
): string {
  return classnames
    .filter(notNull)
    .flatMap((x) => {
      if (typeof x === 'string') {
        return x;
      } else if (typeof x === 'object') {
        const keys = Object.keys(x);
        return keys.filter((key) => x[key] === true);
      } else {
        throw new Error('UNKNOWN TYPE!');
      }
    })
    .join(' ');
}

function notNull<T>(obj: T | null | undefined): obj is T {
  return obj != null;
}

export default App;
