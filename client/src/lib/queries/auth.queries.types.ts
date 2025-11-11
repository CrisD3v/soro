/**
 * Types para TanStack Query - Auth module
 */

import type { UseMutationOptions } from '@tanstack/react-query';
import type {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
  UserData,
} from '../api/auth.types';
import type { ApiError } from '../types/common.types';

// Mutation options types
export type LoginMutationOptions = UseMutationOptions<
  LoginResponse,
  ApiError,
  LoginRequest
>;

export type RegisterMutationOptions = UseMutationOptions<
  UserData,
  ApiError,
  RegisterRequest
>;

export type RefreshTokenMutationOptions = UseMutationOptions<
  RefreshTokenResponse,
  ApiError,
  RefreshTokenRequest
>;

export type LogoutMutationOptions = UseMutationOptions<
  void,
  ApiError,
  LogoutRequest
>;

export type ResetPasswordMutationOptions = UseMutationOptions<
  ResetPasswordResponse,
  ApiError,
  ResetPasswordRequest
>;
