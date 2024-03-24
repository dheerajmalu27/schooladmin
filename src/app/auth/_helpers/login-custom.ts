import * as $ from 'jquery';
export class LoginCustom {
  static handleSignInFormSubmit() {
    $('#m_login_signin_submit').click(function (e) {
      let form = $(this).closest('form');
      (form as any).validate({
        rules: {
          email: {
            required: true,
            email: true,
          },
          password: {
            required: true,
          },
        },
      });
      if (!(form as any).valid()) {
        e.preventDefault();
        return;
      }
    });
  }

  static displaySignUpForm() {
    let login = $('#m_login');
    login.removeClass('m-login--forget-password');
    login.removeClass('m-login--signin');

    login.addClass('m-login--signup');
    login.find('.m-login__signup').css('animation', 'flipInX 0.5s');
  }

  static displaySignInForm() {
    let login = $('#m_login');
    login.removeClass('m-login--forget-password');
    login.removeClass('m-login--signup');
    try {
      $('form').data('validator').resetForm();
    } catch (e) {}

    login.addClass('m-login--signin');
    login.find('.m-login__signin').css('animation', 'flipInX 0.5s');
  }

  static displayForgetPasswordForm() {
    let login = $('#m_login');
    login.removeClass('m-login--signin');
    login.removeClass('m-login--signup');

    login.addClass('m-login--forget-password');
    login.find('.m-login__forget-password').css('animation', 'flipInX 0.5s');
  }

  static handleFormSwitch() {
    $('#m_login_forget_password').click(function (e) {
      e.preventDefault();
      LoginCustom.displayForgetPasswordForm();
    });

    $('#m_login_forget_password_cancel').click(function (e) {
      e.preventDefault();
      LoginCustom.displaySignInForm();
    });

    $('#m_login_signup').click(function (e) {
      e.preventDefault();
      LoginCustom.displaySignUpForm();
    });

    $('#m_login_signup_cancel').click(function (e) {
      e.preventDefault();
      LoginCustom.displaySignInForm();
    });
  }

  static handleSignUpFormSubmit() {
    $('#m_login_signup_submit').click(function (e) {
      let btn = $(this);
      let form = $(this).closest('form');
      (form as any).validate({
        rules: {
          fullname: {
            required: true,
          },
          email: {
            required: true,
            email: true,
          },
          password: {
            required: true,
          },
          rpassword: {
            required: true,
          },
          agree: {
            required: true,
          },
        },
      });
      if (!(form as any).valid()) {
        e.preventDefault();
        return;
      }
    });
  }

  static handleForgetPasswordFormSubmit() {
    $('#m_login_forget_password_submit').click(function (e) {
      let btn = $(this);
      let form = $(this).closest('form');
      (form as any).validate({
        rules: {
          email: {
            required: true,
            email: true,
          },
        },
      });
      if (!(form as any).valid()) {
        e.preventDefault();
        return;
      }
    });
  }

  static init() {
    LoginCustom.handleFormSwitch();
    LoginCustom.handleSignInFormSubmit();
    LoginCustom.handleSignUpFormSubmit();
    LoginCustom.handleForgetPasswordFormSubmit();
  }
}
