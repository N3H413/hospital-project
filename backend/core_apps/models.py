from django.db import models

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Doctor(models.Model):
    name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)
    schedule_info = models.CharField(max_length=200, help_text="e.g., Mon-Fri, 9 AM - 5 PM")
    department = models.ForeignKey(
        Department, 
        on_delete=models.PROTECT, 
        related_name='doctors'
    )

    def __str__(self):
        return f"{self.name} ({self.specialization})"


class Appointment(models.Model):
    # Status configuration choices
    STATUS_CHOICES = [
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]

    patient_name = models.CharField(max_length=100)
    patient_email = models.EmailField()
    patient_phone = models.CharField(max_length=20)
    date = models.DateField()
    time_slot = models.CharField(max_length=50, help_text="e.g., 10:30 AM")
    symptoms = models.TextField(blank=True, null=True)
    doctor = models.ForeignKey(
        Doctor, 
        on_delete=models.PROTECT, 
        related_name='appointments'
    )
    # 👈 New field added to track active vs dropped appointments
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='confirmed'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient_name} - {self.doctor.name} on {self.date} ({self.status})"

class CafeteriaItem(models.Model):
    name = models.CharField(max_length=150)
    time_slot = models.CharField(max_length=100)  # e.g., "Breakfast (7:30 AM - 11:00 AM)"
    price = models.CharField(max_length=20)       # e.g., "₹60"
    health_tag = models.CharField(max_length=50)   # e.g., "Low Oil", "High Protein"

    def __str__(self):
        return f"{self.name} ({self.price})"

class PharmacyItem(models.Model):
    drug_name = models.CharField(max_length=150)
    category = models.CharField(max_length=100)    # e.g., "Analgesic", "Antibiotic"
    status = models.CharField(max_length=50)      # e.g., "In Stock", "Low Stock"
    quantity_display = models.CharField(max_length=100) # e.g., "45 Boxes Left"

    def __str__(self):
        return self.drug_name