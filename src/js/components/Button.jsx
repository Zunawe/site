import React from 'react'

export const Button = (props) => {
  const { as, children } = props

  return React.createElement(as || 'button', {
    className: 'button',
    ...props
  }, children)
}
