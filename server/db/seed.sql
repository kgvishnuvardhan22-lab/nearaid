-- NearAid sample seed data (generated from seed-data.json - do not edit by hand).
-- Every row is clearly labelled SAMPLE. Phone numbers are non-callable placeholders.
-- Run with: psql -d nearaid -f db/seed.sql

INSERT INTO facilities (name, type, address, phone, geom, status, verified) VALUES
('SAMPLE City Care Hospital', 'hospital', '12 SAMPLE Road, T Nagar, Chennai', '+91-00000-00001', ST_SetSRID(ST_MakePoint(80.2341, 13.0418), 4326), 'approved', true),
('SAMPLE Green Cross Hospital', 'hospital', '45 SAMPLE Street, Adyar, Chennai', '+91-00000-00002', ST_SetSRID(ST_MakePoint(80.2572, 13.0067), 4326), 'approved', true),
('SAMPLE Lakeview Multispeciality Hospital', 'hospital', '9 SAMPLE Avenue, Anna Nagar, Chennai', '+91-00000-00003', ST_SetSRID(ST_MakePoint(80.2137, 13.0878), 4326), 'approved', true),
('SAMPLE Sunrise Emergency Hospital', 'hospital', '101 SAMPLE Main Road, Velachery, Chennai', '+91-00000-00004', ST_SetSRID(ST_MakePoint(80.2209, 12.9784), 4326), 'approved', true),
('SAMPLE Riverside General Hospital', 'hospital', '77 SAMPLE Bazaar Road, Mylapore, Chennai', '+91-00000-00005', ST_SetSRID(ST_MakePoint(80.2676, 13.0339), 4326), 'approved', true),
('SAMPLE Metro Trauma Centre', 'hospital', '23 SAMPLE High Road, Kilpauk, Chennai', '+91-00000-00006', ST_SetSRID(ST_MakePoint(80.2423, 13.0773), 4326), 'approved', true),
('SAMPLE Beacon Hospital', 'hospital', '5 SAMPLE Colony, Guindy, Chennai', '+91-00000-00007', ST_SetSRID(ST_MakePoint(80.2206, 13.0067), 4326), 'approved', true),
('SAMPLE Unity Hospital', 'hospital', '31 SAMPLE Salai, Egmore, Chennai', '+91-00000-00008', ST_SetSRID(ST_MakePoint(80.2609, 13.0732), 4326), 'approved', true),
('SAMPLE Horizon Hospital', 'hospital', '68 SAMPLE Nagar, Tambaram, Chennai', '+91-00000-00009', ST_SetSRID(ST_MakePoint(80.1275, 12.9249), 4326), 'approved', true),
('SAMPLE Lighthouse Hospital', 'hospital', '14 SAMPLE Link Road, OMR Perungudi, Chennai', '+91-00000-00010', ST_SetSRID(ST_MakePoint(80.2461, 12.9604), 4326), 'approved', true),
('SAMPLE Red Line Blood Bank', 'blood_bank', '3 SAMPLE Lane, Nungambakkam, Chennai', '+91-00000-00011', ST_SetSRID(ST_MakePoint(80.2425, 13.0569), 4326), 'approved', true),
('SAMPLE LifeDrop Blood Bank', 'blood_bank', '52 SAMPLE Road, Saidapet, Chennai', '+91-00000-00012', ST_SetSRID(ST_MakePoint(80.2231, 13.0213), 4326), 'approved', true),
('SAMPLE Community Blood Centre', 'blood_bank', '8 SAMPLE Street, Perambur, Chennai', '+91-00000-00013', ST_SetSRID(ST_MakePoint(80.2417, 13.1105), 4326), 'approved', true),
('SAMPLE RapidCare Blood Bank', 'blood_bank', '19 SAMPLE Cross Street, Chromepet, Chennai', '+91-00000-00014', ST_SetSRID(ST_MakePoint(80.1462, 12.9516), 4326), 'approved', true),
('SAMPLE Hope Blood Bank', 'blood_bank', '27 SAMPLE Layout, Porur, Chennai', '+91-00000-00015', ST_SetSRID(ST_MakePoint(80.1565, 13.0382), 4326), 'approved', true),
('SAMPLE Northside Blood Centre', 'blood_bank', '41 SAMPLE Road, Royapuram, Chennai', '+91-00000-00016', ST_SetSRID(ST_MakePoint(80.2954, 13.1137), 4326), 'approved', true),
('SAMPLE Trust Blood Bank', 'blood_bank', '63 SAMPLE Nagar, Thiruvanmiyur, Chennai', '+91-00000-00017', ST_SetSRID(ST_MakePoint(80.2594, 12.983), 4326), 'approved', true),
('SAMPLE MediPlus Pharmacy', 'pharmacy', '11 SAMPLE Street, T Nagar, Chennai', '+91-00000-00018', ST_SetSRID(ST_MakePoint(80.2337, 13.0405), 4326), 'approved', true),
('SAMPLE NightOwl Pharmacy', 'pharmacy', '90 SAMPLE Road, Adyar, Chennai', '+91-00000-00019', ST_SetSRID(ST_MakePoint(80.2565, 13.0012), 4326), 'approved', true),
('SAMPLE CarePoint Pharmacy', 'pharmacy', '6 SAMPLE Avenue, Anna Nagar West, Chennai', '+91-00000-00020', ST_SetSRID(ST_MakePoint(80.2016, 13.0946), 4326), 'approved', true),
('SAMPLE QuickMeds Pharmacy', 'pharmacy', '34 SAMPLE Main Road, Velachery, Chennai', '+91-00000-00021', ST_SetSRID(ST_MakePoint(80.2241, 12.9756), 4326), 'approved', true),
('SAMPLE WellSpring Pharmacy', 'pharmacy', '21 SAMPLE Bazaar, Mylapore, Chennai', '+91-00000-00022', ST_SetSRID(ST_MakePoint(80.2689, 13.0368), 4326), 'approved', true),
('SAMPLE 24x7 Sample Pharmacy', 'pharmacy', '55 SAMPLE High Road, Egmore, Chennai', '+91-00000-00023', ST_SetSRID(ST_MakePoint(80.2587, 13.0748), 4326), 'approved', true),
('SAMPLE FamilyCare Pharmacy', 'pharmacy', '17 SAMPLE Colony, Guindy, Chennai', '+91-00000-00024', ST_SetSRID(ST_MakePoint(80.2135, 13.0091), 4326), 'approved', true),
('SAMPLE MediHub Pharmacy', 'pharmacy', '73 SAMPLE Salai, Kodambakkam, Chennai', '+91-00000-00025', ST_SetSRID(ST_MakePoint(80.2274, 13.0521), 4326), 'approved', true),
('SAMPLE SwiftAid Ambulance Service', 'ambulance', '2 SAMPLE Depot Road, Guindy, Chennai', '+91-00000-00026', ST_SetSRID(ST_MakePoint(80.2201, 13.0075), 4326), 'approved', true),
('SAMPLE RapidResponse Ambulance', 'ambulance', '48 SAMPLE Service Lane, Tambaram, Chennai', '+91-00000-00027', ST_SetSRID(ST_MakePoint(80.1301, 12.9261), 4326), 'approved', true),
('SAMPLE CityLine Ambulance', 'ambulance', '15 SAMPLE Stand Road, Broadway, Chennai', '+91-00000-00028', ST_SetSRID(ST_MakePoint(80.2839, 13.0875), 4326), 'approved', true),
('SAMPLE NightShift Ambulance', 'ambulance', '29 SAMPLE Yard, Perungudi OMR, Chennai', '+91-00000-00029', ST_SetSRID(ST_MakePoint(80.2487, 12.9611), 4326), 'approved', true),
('SAMPLE CareRide Ambulance', 'ambulance', '38 SAMPLE Base Road, Kilpauk, Chennai', '+91-00000-00030', ST_SetSRID(ST_MakePoint(80.2401, 13.0789), 4326), 'approved', true);

-- Note: the admin login is created by db/seed.js (needs bcrypt, which SQL cannot do).
