from django.views.generic import TemplateView
from core.__init__ import KTLayout
from core.libs.theme import KTTheme
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
import re
from django.http import JsonResponse
CustomUser = get_user_model()
from dashboard.models import Department,ActivityTag
from django.contrib.sessions.models import Session
from django.contrib.auth.mixins import AccessMixin


class RedirectIfAuthenticatedMixin(AccessMixin):
    """Redirects users to a specified URL if they are already authenticated."""
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('dashboard:dashboard')  # Change 'dashboard:dashboard' to your dashboard URL name
        return super().dispatch(request, *args, **kwargs)

class LoginPage(RedirectIfAuthenticatedMixin,TemplateView):
    template_name = 'profiles/login.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context = KTLayout.init(context)
        KTTheme.addJavascriptFile('js/custom/authentication/sign-in/general.js')
        context.update({
            'layout': KTTheme.setLayout('auth.html', context),
        })
        return context

    def post(self, request, *args, **kwargs):
        # Check if it's an AJAX request
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            email = request.POST.get('email')
            password = request.POST.get('password')
            user = authenticate(request, username=email, password=password)

            if user is not None:
                login(request, user)

                # Fetch activity tags related to the user's department
                if user.department:  # Check if the user has a department
                    # Fetch the activity tags associated with the user's department
                    activity_tags = user.department.activities.all().values_list('tag', flat=True)
                    request.session['activity_tags'] = list(activity_tags)
                    # Logic to include activity tags in your response or context
                    return JsonResponse({
                        'success': True,
                        'redirect_url': '/dashboard/',
                        # 'activity_tags': list(activity_tags)
                        # Convert to list as JsonResponse expects a dictionary or list
                    })
                else:
                    # Handle case where user does not have a department
                    return JsonResponse({
                        'success': True,
                        'redirect_url': '/dashboard/'
                        # Optionally include more context or a message indicating the user has no department
                    })
            else:
                print("not valid")
                # Return JSON response for AJAX request with error message
                return JsonResponse({'success': False, 'error': 'Invalid email or password.'})

        # For non-AJAX requests, just re-render the page with context
        return render(request, self.template_name, self.get_context_data(**kwargs))



class RegisterPage(RedirectIfAuthenticatedMixin,TemplateView):
    template_name = 'profiles/register.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context = KTLayout.init(context)
        KTTheme.addJavascriptFile('js/custom/authentication/sign-in/general.js')
        context.update({
            'layout': KTTheme.setLayout('auth.html', context),
        })
        return context

    def post(self, request, *args, **kwargs):
        form_data = {
            'first_name': request.POST.get('first_name'),
            'last_name': request.POST.get('last_name'),
            'email': request.POST.get('email'),
            'phone': request.POST.get('phone'),
            'password': request.POST.get('password'),
        }
        confirm_password = request.POST.get('confirm_password')

        if CustomUser.objects.filter(email=form_data['email']).exists():
            messages.error(request, 'This email is already registered. Please login.')
            return render(request, self.template_name, {'form_data': form_data, **self.get_context_data(**kwargs)})

        try:
            validate_email(form_data['email'])
        except ValidationError:
            messages.error(request, 'Invalid email')
            return render(request, self.template_name, {'form_data': form_data, **self.get_context_data(**kwargs)})

        if not re.match(r'^\+?1?\d{9,15}$', form_data['phone']):
            messages.error(request, 'Invalid phone number')
            return render(request, self.template_name, {'form_data': form_data, **self.get_context_data(**kwargs)})

        if form_data['password'] != confirm_password:
            messages.error(request, 'Passwords do not match')
            return render(request, self.template_name, {'form_data': form_data, **self.get_context_data(**kwargs)})

        valid, message = self.is_valid_password(form_data['password'])
        if not valid:
            messages.error(request, message)
            return render(request, self.template_name, {'form_data': form_data, **self.get_context_data(**kwargs)})

        try:
            CustomUser.objects.create_user(**form_data)
            messages.success(request, 'Your account has been created! You are now able to log in.')
            return redirect('/profiles/login/')  # Adjust as needed
        except Exception as e:
            messages.error(request, f'Error creating account: {e}')
            return render(request, self.template_name, {'form_data': form_data, **self.get_context_data(**kwargs)})

    def is_valid_password(self, password):
        if len(password) < 4:
            return False, "Password must be at least 3 characters long."
        elif len(password) > 15:
            return False, "Password must not exceed 15 characters."

        if re.search(r'(.)\1{3,}', password):
            return False, "Password cannot contain four similar characters in a row."

        for i in range(len(password) - 3):
            substring = password[i:i + 4]
            if substring.isdigit():
                if ''.join(str(int(substring[0]) + i) for i in range(4)) == substring or \
                        ''.join(str(int(substring[0]) - i) for i in range(4)) == substring:
                    return False, "Password cannot contain a sequence of four continuous numbers."

        return True, ""



class LogoutPage(TemplateView):
    template_name = 'profiles/login.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context = KTLayout.init(context)
        KTTheme.addJavascriptFile('js/custom/authentication/sign-in/general.js')
        context.update({
            'layout': KTTheme.setLayout('auth.html', context),
        })
        return context

    def get(self, request, *args, **kwargs):
        user_id = str(request.user.id)  # Convert user id to string

        # Iterate through all active sessions.
        for session in Session.objects.all():
            session_data = session.get_decoded()
            # Check if the user's ID is stored in this session.
            if session_data.get('_auth_user_id', None) == user_id:
                # If so, delete the session.
                session.delete()

        # Log out the user from the current session.
        logout(request)
        messages.success(request, 'You have been successfully logged out.')
        return redirect('profiles:login')  # Redirect to the login page or your preferred page
