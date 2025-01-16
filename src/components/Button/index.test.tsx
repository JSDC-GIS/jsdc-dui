import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import Button from '.'

describe('button works fine', () => {
  test('button child shows up', () => {
    const { getByText } = render(<Button>button</Button>)
    expect(getByText('button')).toBeTruthy()
  })
})
