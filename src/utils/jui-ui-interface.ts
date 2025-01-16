import React from 'react'

export interface IPropsWithChildren {
  children?: React.ReactNode
}

export interface IPropsWithSize {
  size?: 'sm' | 'md' | 'larg' | 'xsm' | 'xlarg'
}

export interface IPropsWithDisplayVarient {
  varient?: 'dense' | 'primary' | 'accent' | 'flat'
  hollow?: boolean
}
