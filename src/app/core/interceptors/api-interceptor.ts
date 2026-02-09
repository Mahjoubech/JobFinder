import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const user = localStorage.getItem('user');
  if(user){
    const parsedUser = JSON.parse(user);
    const cloned = req.clone({
      setHeaders: {
        'user_id' : parsedUser.id
      }
    })
    return next(cloned);
  }
  return next(req);
};
