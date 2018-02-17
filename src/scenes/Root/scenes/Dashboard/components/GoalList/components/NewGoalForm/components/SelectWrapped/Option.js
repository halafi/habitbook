// @flow
import React from 'react'

import { MenuItem } from 'material-ui/Menu'

type Props = any

export default class Option extends React.Component<Props> {
  handleClick = (event: any) => {
    this.props.onSelect(this.props.option, event)
  }

  render() {
    const { children, isFocused, isSelected, onFocus } = this.props

    return (
      <MenuItem
        onFocus={onFocus}
        selected={isFocused}
        onClick={this.handleClick}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400,
        }}
      >
        {children}
      </MenuItem>
    )
  }
}
