from django.contrib import admin
# ➕ Added Cafeteria and Pharmacy to the import statement
from .models import Department, Doctor, Appointment, CafeteriaItem, PharmacyItem

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'specialization', 'department')
    list_filter = ('department',)

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('patient_name', 'doctor', 'date', 'time_slot')
    list_filter = ('date', 'doctor')

# ➕ Added registration for Cafeteria
@admin.register(CafeteriaItem)
class CafeteriaAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price')  # Customize these fields based on your model's attributes

# ➕ Added registration for Pharmacy
@admin.register(PharmacyItem)
class PharmacyAdmin(admin.ModelAdmin):
    list_display = ('drug_name', 'category', 'status', 'quantity_display')