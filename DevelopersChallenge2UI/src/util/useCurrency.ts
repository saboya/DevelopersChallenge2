import * as React from 'react'
import accounting = require('accounting')

type UseCurrencyProps = typeof accounting['settings']['currency'] & {
  currency?: string
}

type CurrencyFormatter = (value: number) => string

export type UseCurrencyReturn = [CurrencyFormatter, string, string] & {
  formatter: CurrencyFormatter
  symbol: string
  name: string
}

interface LocalizationObj {
  [key: string]: {
    symbol: string
    decimal: string
    thousand: string
  }
}

const localization: LocalizationObj = {
  BRL: {
    symbol: 'R$',
    decimal: ',',
    thousand: '.',
  },
  USD: {
    symbol: '$',
    decimal: '.',
    thousand: ',',
  },
}

export const useCurrency: (props: UseCurrencyProps) => UseCurrencyReturn = ({ currency = 'BRL', ...props }: Partial<UseCurrencyProps>) => {
  const [defaultOptions, setDefaultOptions] = React.useState<UseCurrencyProps>(() => ({
    symbol: localization[currency].symbol,
    thousand: localization[currency].thousand,
    decimal: localization[currency].decimal,
    format: props.format || '%v',
    precision: 2,
    ...props,
  }))

  React.useEffect(() => {
    setDefaultOptions({
      symbol: localization[currency].symbol,
      thousand: localization[currency].thousand,
      decimal: localization[currency].decimal,
      format: props.format || '%v',
      precision: 2,
      ...props,
    })
  }, [currency, props.format, props.precision, props.thousand, props.symbol, props.decimal])

  const formatter = React.useCallback((value: number, options?: typeof accounting['settings']['currency']) => {
    let formatOptions = defaultOptions

    if (options !== undefined) {
      formatOptions = { ...formatOptions, ...options }
    }

    return accounting.formatMoney(value,
      formatOptions.symbol,
      formatOptions.precision,
      formatOptions.thousand,
      formatOptions.decimal,
      formatOptions.format,
    )
  }, [defaultOptions])

  // Can't type this shit correctly in Typescript
  const temp = [formatter, currency, localization[currency].symbol] as any
  temp.formatter = formatter
  temp.name = currency
  temp.symbol = localization[currency].symbol

  return temp
}
