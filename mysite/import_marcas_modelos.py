import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
django.setup()

from ConectaCar.models import Marca, Modelo

marcas_modelos = [
    {'marca': 'Toyota', 'modelos': ['Corolla', 'Camry', 'RAV4', 'Highlander', 'Prius']},
    {'marca': 'Ford', 'modelos': ['Fiesta', 'Focus', 'Mustang', 'Explorer', 'F-150']},
    {'marca': 'Chevrolet', 'modelos': ['Spark', 'Malibu', 'Impala', 'Equinox', 'Tahoe']},
    {'marca': 'Honda', 'modelos': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Fit']},
    {'marca': 'Nissan', 'modelos': ['Versa', 'Sentra', 'Altima', 'Rogue', 'Pathfinder']},
    {'marca': 'BMW', 'modelos': ['Series 1', 'Series 3', 'Series 5', 'X3', 'X5']},
    {'marca': 'Mercedes-Benz', 'modelos': ['A-Class', 'C-Class', 'E-Class', 'GLA', 'GLC']},
    {'marca': 'Audi', 'modelos': ['A1', 'A3', 'A4', 'Q3', 'Q5']},
    {'marca': 'Volkswagen', 'modelos': ['Polo', 'Golf', 'Passat', 'Tiguan', 'Touareg']},
    {'marca': 'Hyundai', 'modelos': ['Accent', 'Elantra', 'Sonata', 'Tucson', 'Santa Fe']},
    {'marca': 'Kia', 'modelos': ['Rio', 'Forte', 'Optima', 'Sportage', 'Sorento']},
    {'marca': 'Mazda', 'modelos': ['Mazda2', 'Mazda3', 'Mazda6', 'CX-3', 'CX-5']},
    {'marca': 'Subaru', 'modelos': ['Impreza', 'Legacy', 'Outback', 'Forester', 'Ascent']},
    {'marca': 'Tesla', 'modelos': ['Model S', 'Model 3', 'Model X', 'Model Y']},
    {'marca': 'Volvo', 'modelos': ['S60', 'S90', 'XC40', 'XC60', 'XC90']},
    {'marca': 'Alfa Romeo', 'modelos': ['Giulia', 'Stelvio', 'Giulietta', '4C', 'Tonale']},
    {'marca': 'Aston Martin', 'modelos': ['DB11', 'Vantage', 'DBS Superleggera', 'Rapide', 'DBX']},
    {'marca': 'Citroën', 'modelos': ['C1', 'C3', 'C4', 'C5 Aircross', 'Berlingo']},
    {'marca': 'Ferrari', 'modelos': ['488', 'Portofino', 'Roma', 'SF90 Stradale', '812 Superfast']},
    {'marca': 'Fiat', 'modelos': ['500', 'Panda', 'Tipo', '500X', 'Ducato']},
    {'marca': 'Jaguar', 'modelos': ['XE', 'XF', 'F-Type', 'E-PACE', 'F-PACE']},
    {'marca': 'Jeep', 'modelos': ['Renegade', 'Compass', 'Cherokee', 'Grand Cherokee', 'Wrangler']},
    {'marca': 'Land Rover', 'modelos': ['Range Rover', 'Range Rover Sport', 'Discovery', 'Defender', 'Evoque']},
    {'marca': 'Lexus', 'modelos': ['IS', 'ES', 'GS', 'NX', 'RX']},
    {'marca': 'Maserati', 'modelos': ['Ghibli', 'Quattroporte', 'Levante', 'GranTurismo', 'MC20']},
    {'marca': 'Mini', 'modelos': ['Cooper', 'Countryman', 'Clubman', 'Paceman', 'Roadster']},
    {'marca': 'Mitsubishi', 'modelos': ['Mirage', 'Eclipse Cross', 'Outlander', 'Pajero', 'ASX']},
    {'marca': 'Peugeot', 'modelos': ['208', '308', '3008', '5008', 'Rifter']},
    {'marca': 'Porsche', 'modelos': ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan']},
    {'marca': 'Renault', 'modelos': ['Clio', 'Megane', 'Kadjar', 'Captur', 'Twingo']},
    {'marca': 'Saab', 'modelos': ['9-3', '9-5', '9-4X', '9-7X', '900']},
    {'marca': 'Seat', 'modelos': ['Ibiza', 'Leon', 'Arona', 'Ateca', 'Tarraco']},
    {'marca': 'Skoda', 'modelos': ['Fabia', 'Octavia', 'Superb', 'Kodiaq', 'Kamiq']},
    {'marca': 'Suzuki', 'modelos': ['Swift', 'Vitara', 'S-Cross', 'Jimny', 'Baleno']},
]

def importar_marcas_modelos():
    for item in marcas_modelos:
        marca_nombre = item['marca']
        modelos = item['modelos']
        
        marca, created = Marca.objects.get_or_create(nombre=marca_nombre)
        
        for modelo_nombre in modelos:
            Modelo.objects.get_or_create(nombre=modelo_nombre, marca=marca)

if __name__ == '__main__':
    importar_marcas_modelos()
    print("Datos importados exitosamente.")
