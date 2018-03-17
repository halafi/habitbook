import {
  profileSelector,
  currentUserIdSelector,
  goalsSelector,
  usersSelector,
  userEmailsSelector,
  sharedGoalsSelector,
} from './firebaseSelectors'

describe('Firebase selectors', () => {
  it('#profileSelector', () => {
    const state = {
      firebase: {
        profile: 'PROFILE',
      },
    }
    expect(profileSelector(state)).toEqual('PROFILE')
  })
  it('#currentUserIdSelector', () => {
    const state = {
      firebase: {
        auth: {
          uid: 'UID',
        },
      },
    }
    expect(currentUserIdSelector(state)).toEqual('UID')
  })
  it('#goalsSelector', () => {
    const state = {
      firebase: {
        data: {
          goals: 'GOALS',
          users: 'USERS',
          sharedGoals: 'SHARED_GOALS',
        },
      },
    }
    expect(goalsSelector(state)).toEqual('GOALS')
  })
  it('#usersSelector', () => {
    const state = {
      firebase: {
        data: {
          goals: 'GOALS',
          users: 'USERS',
          sharedGoals: 'SHARED_GOALS',
        },
      },
    }
    expect(usersSelector(state)).toEqual('USERS')
  })
  it('#sharedGoalsSelector', () => {
    const state = {
      firebase: {
        data: {
          goals: 'GOALS',
          users: 'USERS',
          sharedGoals: 'SHARED_GOALS',
        },
      },
    }
    expect(sharedGoalsSelector(state)).toEqual('SHARED_GOALS')
  })
  it('#userEmailsSelector', () => {
    const state = {
      firebase: {
        data: {
          users: {
            foo: {
              email: 'oof',
            },
            bar: {
              email: 'rab',
            },
          },
        },
      },
    }
    expect(userEmailsSelector(state)).toEqual(['oof', 'rab'])
  })
})
