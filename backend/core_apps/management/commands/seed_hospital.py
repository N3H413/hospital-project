from django.core.management.base import BaseCommand
from core_apps.models import Department, Doctor, Appointment, CafeteriaItem, PharmacyItem 

class Command(BaseCommand):
    help = 'Seeds medical and facility databases cleanly with test assets'

    def handle(self, *args, **options):
        self.stdout.write("🧹 Purging older records...")
        
        # 1. Clear appointments first to remove dependencies on Doctor records
        Appointment.objects.all().delete()
        
        # 2. Safely clear out the core clinical data
        Doctor.objects.all().delete()
        Department.objects.all().delete()
        
        # 3. Clear facility amenities tables
        CafeteriaItem.objects.all().delete()
        PharmacyItem.objects.all().delete()

        self.stdout.write("🌱 Seeding Clinical Core...")
        cardio = Department.objects.create(name="Cardiology")
        peds = Department.objects.create(name="Pediatrics")
        ortho = Department.objects.create(name="Orthopedics")

        Doctor.objects.create(department=cardio, name="Dr. Aarav Mehta", specialization="Interventional Cardiology", schedule_info="Mon-Sat, 09:30 AM - 01:30 PM IST")
        Doctor.objects.create(department=cardio, name="Dr. Ananya Sharma", specialization="Heart Failure Specialist", schedule_info="Mon-Fri, 02:30 PM - 06:30 PM IST")
        Doctor.objects.create(department=peds, name="Dr. Rohan Deshmukh", specialization="Neonatal Care", schedule_info="Mon-Sat, 10:00 AM - 04:00 PM IST")
        Doctor.objects.create(department=ortho, name="Dr. Priya Nair", specialization="Joint Replacement Surgery", schedule_info="Tue, Thu, Sat, 11:00 AM - 05:00 PM IST")

        self.stdout.write("🍔 Seeding Cafeteria & Pharmacy...")
        CafeteriaItem.objects.create(name="Idli Sambar Platter (2 Pcs)", time_slot="Breakfast (7:30 AM - 11:00 AM)", price="₹60", health_tag="Low Oil")
        CafeteriaItem.objects.create(name="Healthy Sprouts & Fruit Salad", time_slot="All Day Availability", price="₹80", health_tag="High Protein")
        CafeteriaItem.objects.create(name="Standard Veg Thali", time_slot="Lunch (12:30 PM - 3:30 PM)", price="₹120", health_tag="Balanced Diet")
        CafeteriaItem.objects.create(name="Fresh Tender Coconut Water", time_slot="24/7 Energy Counter", price="₹50", health_tag="Hydration")
        
        PharmacyItem.objects.create(drug_name="Paracetamol 650mg", category="Analgesic", status="In Stock", quantity_display="High Availability")
        PharmacyItem.objects.create(drug_name="Amoxicillin 500mg", category="Antibiotic", status="In Stock", quantity_display="45 Boxes Left")
        PharmacyItem.objects.create(drug_name="Insulin Glargine Pen", category="Diabetes", status="Low Stock", quantity_display="Only 8 Units Left")
        PharmacyItem.objects.create(drug_name="N95 Medical Grade Masks", category="Protective Wear", status="In Stock", quantity_display="Bulk Available")

        self.stdout.write(self.style.SUCCESS('🎉 Hospital database tables successfully synchronized and populated!'))