import { BaseThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk';
import { appActions } from 'app/app.reducer';
import {  AppRootDispatchType, AppRootStateType } from 'app/store';
import { handleServerNetworkError } from 'common/utils/handle-server-network-error';

/**
 * A higher-order thunk that handles network errors and dispatches loading status.
 * 
 * @async
 * @param {BaseThunkAPI<AppRootStateType, any, AppRootDispatchType, null>} thunkAPI - The thunk API.
 * @param {Function} logic - The function to execute.
 * @returns {Promise} The promise that resolves or rejects with a value.
 */
export const thunkTryCatch = async (thunkAPI: BaseThunkAPI<AppRootStateType, any, AppRootDispatchType, null>, logic: Function) => {
	const { dispatch, rejectWithValue } = thunkAPI
	dispatch(appActions.setStatus({ status: 'loading' }))
	try {
		return await logic()
	} catch (e) {
		handleServerNetworkError(e, dispatch)
		return rejectWithValue(null)
	} finally {
		// в handleServerNetworkError можно удалить убирани крутилки
		dispatch(appActions.setStatus({ status: 'idle' }))
	}
}
