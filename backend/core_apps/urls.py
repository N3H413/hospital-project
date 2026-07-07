from django.urls import path
from .views import (
    DepartmentListView, 
    DoctorListView, 
    AppointmentCreateListView,
    AppointmentDetailView,
    CafeteriaItemListView,
    PharmacyItemListView
)

urlpatterns = [
    path('departments/', DepartmentListView.as_view(), name='department-list'),
    path('doctors/', DoctorListView.as_view(), name='doctor-list'),
    path('appointments/', AppointmentCreateListView.as_view(), name='appointment-list-create'),
    path('appointments/<int:pk>/', AppointmentDetailView.as_view(), name='appointment-detail'), 
    path('cafeteria/', CafeteriaItemListView.as_view(), name='cafeteria-list'),
    path('pharmacy/', PharmacyItemListView.as_view(), name='pharmacy-list'),
]
