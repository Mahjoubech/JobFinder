import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const user = localStorage.getItem('user');

  if (!user || user === 'undefined' || user === 'null') {
    return next(req);
  }

  try {
    const parsedUser = JSON.parse(user);

    if (parsedUser?.id) {
      const cloned = req.clone({
        setHeaders: {
          'user_id': String(parsedUser.id)
        }
      });

      return next(cloned);
    }
  } catch (e) {
    console.error('Invalid user in localStorage');
  }

  return next(req);
};
