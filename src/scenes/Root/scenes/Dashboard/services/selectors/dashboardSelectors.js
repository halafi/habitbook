// @flow

import type { GlobalState } from '../../../../../../common/reducers/index'

// eslint-disable-next-line import/prefer-default-export
export const selectedUserIdSelector = (state: GlobalState) => state.dashboard.selectedUser
