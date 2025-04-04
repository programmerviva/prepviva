'use server';

import { db, auth } from '@/firebase/admin';
import { cookies } from 'next/headers';

const TWO_WEEK = 60 * 60 * 24 * 15 * 1000; // 15 days

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    const userRecord = await db.collection('users').doc(uid).get();

    if (userRecord.exists) {
      return {
        success: false,
        message: 'User already exists. Please sign in instead.',
      };
    }

    await db.collection('users').doc(uid).set({
      name,
      email,
    });
  } catch (error: any) {
    console.log('Error creating a user', error);

    if (error.code === 'auth/email-already-exists') {
      return {
        success: false,
        message: 'Email already exists.',
        error: error.code,
      };
    }

    return {
      success: false,
      message: 'Failed to create an account.',
      error: error.code,
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const useRecord = await auth.getUserByEmail(email);

    if (!useRecord) {
      return {
        success: false,
        message: 'User not found. Please sign up instead.',
      };
    }

    await setSessionCookie(idToken);
  } catch (error: any) {
    console.log('Error signing in', error);

    return {
      success: false,
      message: 'Failed to sign in.',
      error: error.code,
    };
  }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: TWO_WEEK, // 15 days
  });

  cookieStore.set('session', sessionCookie, {
    maxAge: TWO_WEEK, // 15 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });
}
