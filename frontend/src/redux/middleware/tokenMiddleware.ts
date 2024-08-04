import { Middleware } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const tokenMiddleware: Middleware = ({ getState }) => next => action => {
  const state = getState();
  const token = state.auth.token;

  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }

  return next(action);
};