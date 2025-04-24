/**
 * Show toast
 * 
 * @param {*} toastRef 
 * @param {*} errors 
 * @returns 
 */
export const showErrorToasts = (toastRef, errors = []) => {
  if (!toastRef?.current || !Array.isArray(errors)) return;

  errors.forEach(err => {
    toastRef.current.show({
      severity: 'error',
      summary: 'Error',
      detail: err,
      life: 4000
    });
  });
};

/**
 * Show success toast
 * 
 * @param {*} toastRef 
 * @param {*} message 
 */
export const showSuccessToast = (toastRef, message) => {
  if (!toastRef?.current || !message) return;

  toastRef.current.show({
    severity: 'success',
    summary: 'Success',
    detail: message,
    life: 4000
  });
};

