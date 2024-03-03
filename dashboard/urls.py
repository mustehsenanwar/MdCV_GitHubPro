from django.urls import path
from dashboard.admin_dash import views as admin_dash_views
from dashboard.orderprocessing_dash import views as orderprocessing_dash_views
from dashboard.salesmarketing_dash import views as salesmarketing_dash_views

from orders import views as orders_views
from resume_templates import views as resume_templates_views

from dashboard.test import views as test_views



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
    path('myorders/', orders_views.MyOrders.as_view(template_name = 'orders/myorders.html'), name='myorders'),
    path('orderslist/', orders_views.OrdersList.as_view(template_name = 'orders/orderslist.html'), name='orderslist'),
    path('resumebuilder/<int:order_id>/', resume_templates_views.ResumeBuilder.as_view(template_name='resume_templates/index.html'), name='resumebuilder'),
    path('template_list/<int:order_id>/', resume_templates_views.TemplateList.as_view(template_name='resume_templates/templates_list.html'), name='template_list'),
    path('create_new_template/', resume_templates_views.CreateNewTemplate.as_view(template_name = 'resume_templates/create_new_template.html'), name='create_new_template'),
    
    
    
    # path('test/',test_views.example_page),
    # path('test/<int:order_id>/', test_views.example_page.as_view(template_name='resume_templates/all_templates/template1.html'), name='resumebuilder'),
    # aftersales urls
]