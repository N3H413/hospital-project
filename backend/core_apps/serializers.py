from rest_framework import serializers
from .models import Department, Doctor, Appointment
from .models import CafeteriaItem, PharmacyItem

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['id', 'name', 'specialization', 'schedule_info', 'department']


class DepartmentSerializer(serializers.ModelSerializer):
    # Nests the assigned doctors right inside the department data package
    doctors = DoctorSerializer(many=True, read_only=True)

    class Meta:
        model = Department
        fields = ['id', 'name', 'description', 'doctors']


class AppointmentSerializer(serializers.ModelSerializer):
    # read-only helper to show the text name of the doctor along with their ID
    doctor_name = serializers.ReadOnlyField(source='doctor.name')

    class Meta:
        model = Appointment
        fields = [
            'id', 'patient_name', 'patient_email', 'patient_phone', 
            'date', 'time_slot', 'symptoms', 'doctor', 'doctor_name', 'created_at',
            'status' 
        ]

    def validate(self, data):
        doctor = data.get('doctor')
        date = data.get('date')
        time_slot = data.get('time_slot')

        # 1. Prevent Double-Booking (Excluding current instance if updating)
        booking_query = Appointment.objects.filter(
            doctor=doctor,
            date=date,
            time_slot__iexact=time_slot.strip()
        )
        if self.instance:
            booking_query = booking_query.exclude(pk=self.instance.pk)

        if booking_query.exists():
            raise serializers.ValidationError({
                "time_slot": "This specific time slot has already been reserved for this practitioner."
            })

        # 2. Global Operational Day Check (Saturday = 5, Sunday = 6)
        if date and date.weekday() in [5, 6]:
            raise serializers.ValidationError({
                "date": "Clinical consultations are unavailable on weekends."
            })

        return data

class CafeteriaItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CafeteriaItem
        fields = '__all__'

class PharmacyItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PharmacyItem
        fields = '__all__'