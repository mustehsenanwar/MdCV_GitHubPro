from django.views.generic import TemplateView

from django.http import HttpResponse
from django.conf import settings
from django.urls import resolve
from core.__init__ import KTLayout
from core.libs.theme import KTTheme

from django.views.generic import ListView
from django.shortcuts import redirect
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from .models import ChatPrompt, PromptCategory
from django.http import JsonResponse
from chatgpt_integration.utils import process_prompt




class ChatPromptList(LoginRequiredMixin, UserPassesTestMixin, TemplateView):
    model = ChatPrompt
    context_object_name = 'chat_prompts'
    template_name = 'chatgpt_integration/chatgpt.html'

    def test_func(self):
        activity_tags = self.request.session.get('activity_tags', [])
        if "orderprocessing" in activity_tags:
            return True
        return self.request.user.is_superuser

    # Predefined function
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context = KTLayout.init(context)
        KTTheme.addVendors(['amcharts', 'amcharts-maps', 'amcharts-stock'])

        context['user'] = self.request.user
        context['chat_prompts'] = ChatPrompt.objects.all()  # Add all ChatPrompt objects to context
        context['categories'] = PromptCategory.objects.all()  # Add all PromptCategory objects to context


        return context

    def handle_no_permission(self):
        return HttpResponse('you are at home pge')
    
    
    # def get(self, request, *args, **kwargs):
    #     processed_prompt = process_prompt(order_id=59, prompt_id=6)
    #     print(processed_prompt)
    #     return HttpResponse("Hello, this is the GET response.")

    def post(self, request, *args, **kwargs):
            # Check if it's an AJAX request
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                # Extract data from POST request
                action = request.POST.get('action')
                category_id = request.POST.get('category_id')
                prompt_id = request.POST.get('prompt_id')

                if action == 'delete_category':
                    category = PromptCategory.objects.get(id=category_id)
                    category.delete()
                    return JsonResponse({'status': 'success'})

                elif action == 'delete_prompt':
                    prompt = ChatPrompt.objects.get(id=prompt_id)
                    prompt.delete()
                    return JsonResponse({'status': 'success'})

                elif action == 'update_prompt':
                    prompt_id = request.POST.get('prompt_id')
                    new_text = request.POST.get('new_text')
                    try:
                        prompt = ChatPrompt.objects.get(id=prompt_id)
                        prompt.template = new_text
                        prompt.save()
                        return JsonResponse({'status': 'success'})
                    except ChatPrompt.DoesNotExist:
                        return JsonResponse({'status': 'error', 'message': 'Prompt not found'})

            # If not AJAX, handle form submission
            else:
                category_name = request.POST.get('category_name')
                prompt_name = request.POST.get('prompt_name')
                template = request.POST.get('template')
                description = request.POST.get('description')

                category, _ = PromptCategory.objects.get_or_create(name=category_name)

                ChatPrompt.objects.create(
                    category=category,
                    name=prompt_name,
                    template=template,
                    description=description
                )

                return redirect('dashboard:chatgpt')