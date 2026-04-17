import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import type { UserProfile } from '../../types';
import type { AppDispatch } from '../../app/store';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  profile: null,
  loading: false,
  initialized: false,
  error: null,
};

const buildProfile = async (user: User): Promise<UserProfile | null> => {
  const profileRef = doc(db, 'userProfiles', user.uid);
  const profileSnapshot = await getDoc(profileRef);
  if (!profileSnapshot.exists()) {
    return null;
  }

  const data = profileSnapshot.data();
  return {
    id: user.uid,
    email: user.email ?? '',
    displayName: String(data.displayName ?? user.displayName ?? 'Traveler'),
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? undefined,
  };
};

export const hydrateAuth = createAsyncThunk<{ user: User | null; profile: UserProfile | null }, User | null>(
  'auth/hydrate',
  async (user) => {
    if (!user) {
      return { user: null, profile: null };
    }

    return { user, profile: await buildProfile(user) };
  },
);

export const signUpUser = createAsyncThunk<
  { user: User; profile: UserProfile },
  { email: string; password: string; displayName: string },
  { rejectValue: string }
>('auth/signUpUser', async ({ email, password, displayName }, { rejectWithValue }) => {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName });

    await setDoc(doc(db, 'userProfiles', credential.user.uid), {
      email,
      displayName,
      createdAt: serverTimestamp(),
    });

    return {
      user: credential.user,
      profile: {
        id: credential.user.uid,
        email,
        displayName,
      },
    };
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Unable to create account.');
  }
});

export const signInUser = createAsyncThunk<
  { user: User; profile: UserProfile | null },
  { email: string; password: string },
  { rejectValue: string }
>('auth/signInUser', async ({ email, password }, { rejectWithValue }) => {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return {
      user: credential.user,
      profile: await buildProfile(credential.user),
    };
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Unable to sign in.');
  }
});

export const signOutUser = createAsyncThunk<void, void, { rejectValue: string }>('auth/signOutUser', async (_, { rejectWithValue }) => {
  try {
    await signOut(auth);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Unable to sign out.');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrateAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
      })
      .addCase(hydrateAuth.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.error = action.error.message ?? 'Failed to initialize auth.';
      })
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Sign up failed.';
      })
      .addCase(signInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Sign in failed.';
      })
      .addCase(signOutUser.fulfilled, (state) => {
        state.user = null;
        state.profile = null;
        state.loading = false;
      });
  },
});

export const initializeAuthListener = (dispatch: AppDispatch) =>
  onAuthStateChanged(auth, (user) => {
    void dispatch(hydrateAuth(user));
  });

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
