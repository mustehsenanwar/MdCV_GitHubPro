from django.urls import path
from dashboard.admin_dash import views as admin_dash_views
from dashboard.orderprocessing_dash import views as orderprocessing_dash_views
from dashboard.salesmarketing_dash import views as salesmarketing_dash_views



app_name = 'dashboard'


urlpatterns = [
    # Dashboard urls
    path('', admin_dash_views.DashboardPage.as_view(template_name = 'dashboard/dashboard_templates/dashboard.html'), name='dashboard'),

    # admin urls
    path('allusers/', admin_dash_views.AllUsersPage.as_view(template_name = 'dashboard/admin_templates/allusers.html'), name='allusers'),
    path('departments/', admin_dash_views.DepartmentsListPage.as_view(template_name = 'dashboard/admin_templates/departments.html'), name='departments'),

    # salesmarketing  urll
    path('inputorder/', salesmarketing_dash_views.InputOrderPage.as_view(template_name = 'dashboard/salesmarketing_templates/inputorder.html'), name='inputorder'),
    # orderprocessing urls
    path('allorders/', orderprocessing_dash_views.AllOrdersPage.as_view(template_name = 'dashboard/orderprocessing_templates/allorders.html'), name='allorders'),
    path('resumebuilder/', orderprocessing_dash_views.ResumeBuilder.as_view(template_name = 'dashboard/orderprocessing_templates/resumebuilder.html'), name='resumebuilder'),
    path('template_list/', orderprocessing_dash_views.TemplateList.as_view(template_name = 'dashboard/orderprocessing_templates/template_list.html'), name='template_list'),

    # aftersales urls
]