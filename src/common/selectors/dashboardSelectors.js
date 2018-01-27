// @flow

import { createSelector } from 'reselect'
import * as R from 'ramda'

export const selectedUserIdSelector = state => state.dashboard.selectedUser
