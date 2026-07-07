from rest_framework import generics
from .models import Department, Doctor, Appointment, CafeteriaItem, PharmacyItem
from .serializers import (
    DepartmentSerializer, 
    DoctorSerializer, 
    AppointmentSerializer, 
    CafeteriaItemSerializer, 
    PharmacyItemSerializer
)

class DepartmentListView(generics.ListCreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


class DoctorListView(generics.ListCreateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer


class AppointmentCreateListView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        queryset = Appointment.objects.all().order_by('-date')
        email = self.request.query_params.get('email', None)
        if email is not None:
            queryset = queryset.filter(patient_email__iexact=email)
        return queryset


# NEW: Explicit Detail View to handle PATCH cancellation actions
class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer


class CafeteriaItemListView(generics.ListCreateAPIView):
    queryset = CafeteriaItem.objects.all()
    serializer_class = CafeteriaItemSerializer


class PharmacyItemListView(generics.ListCreateAPIView):
    queryset = PharmacyItem.objects.all()
    serializer_class = PharmacyItemSerializer