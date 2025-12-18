import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        // Return dummy sustainability data for demo - aligned with fleet data (10 vehicles: 4 Diesel, 2 CNG, 2 Electric, 2 Petrol)
        const dummySustainabilityData = {
            totalEmissionsReduced: 12450, // kg CO₂ - matches analytics
            carbonFootprintReduction: 18.2,
            evAdoptionRate: 20, // 2 Electric vehicles out of 10 = 20%
            fuelSavings: 245000, // In INR - matches analytics costSavings
            sustainabilityScore: 7.8,
            monthlyTrend: 12.4,
            complianceScore: 94.2,
            renewableEnergyUsage: 35.5, // Lower due to only 20% EV adoption
            complianceItems: [
                {
                    id: '1',
                    title: 'ISO 14001 Environmental Certification',
                    status: 'compliant',
                    dueDate: '2025-12-31',
                    description: 'Annual environmental management system review'
                },
                {
                    id: '2',
                    title: 'Carbon Emissions Reporting',
                    status: 'warning',
                    dueDate: '2025-12-15',
                    description: 'Quarterly emissions report due soon'
                },
                {
                    id: '3',
                    title: 'Fleet Emission Standards (Bharat Stage VI)',
                    status: 'compliant',
                    dueDate: '2026-01-15',
                    description: 'All vehicles meet BS-VI emission standards'
                },
                {
                    id: '4',
                    title: 'Green Transport Initiative Compliance',
                    status: 'warning',
                    dueDate: '2025-12-20',
                    description: 'Target 30% clean fuel vehicles by year end'
                }
            ],
            environmentalGoals: [
                {
                    id: '1',
                    title: 'Carbon Neutral Fleet',
                    target: 50,
                    current: 20,
                    unit: '% EV adoption',
                    deadline: '2026-12-31',
                    progress: 40 // 20 out of 50
                },
                {
                    id: '2',
                    title: 'Emission Reduction',
                    target: 15000,
                    current: 12450,
                    unit: 'kg CO₂',
                    deadline: '2025-12-31',
                    progress: 83 // 12450 / 15000
                },
                {
                    id: '3',
                    title: 'Clean Fuel Adoption',
                    target: 60,
                    current: 40, // 2 Electric + 2 CNG = 4 out of 10 = 40%
                    unit: '% clean fuel',
                    deadline: '2026-06-30',
                    progress: 66.67 // 40 / 60
                },
                {
                    id: '4',
                    title: 'Fleet Efficiency Target',
                    target: 90,
                    current: 86, // Matches analytics fleetEfficiency
                    unit: '% efficiency',
                    deadline: '2025-12-31',
                    progress: 95.56 // 86 / 90
                }
            ],
            emissionsByVehicle: [
                // Diesel vehicles (4) - highest emissions
                { vehicleId: "veh-001", vehicleNumber: "MH-02-AB-1234", model: "Tata LPT 1618", emissions: 1850.5, fuelType: "Diesel", type: "Truck" },
                { vehicleId: "veh-002", vehicleNumber: "DL-01-CD-5678", model: "Ashok Leyland 1820", emissions: 2120.8, fuelType: "Diesel", type: "Truck" },
                { vehicleId: "veh-004", vehicleNumber: "TN-09-GH-3456", model: "Eicher Pro 3015", emissions: 1680.2, fuelType: "Diesel", type: "Truck" },
                { vehicleId: "veh-010", vehicleNumber: "TN-01-UV-1357", model: "BharatBenz 1617R", emissions: 1920.5, fuelType: "Diesel", type: "Truck" },
                
                // CNG vehicles (2) - moderate emissions
                { vehicleId: "veh-003", vehicleNumber: "KA-03-EF-9012", model: "Mahindra Bolero Pickup", emissions: 580.5, fuelType: "CNG", type: "Van" },
                { vehicleId: "veh-006", vehicleNumber: "WB-01-KL-2345", model: "Force Traveller", emissions: 645.8, fuelType: "CNG", type: "Van" },
                
                // Electric vehicles (2) - zero emissions
                { vehicleId: "veh-005", vehicleNumber: "GJ-01-IJ-7890", model: "Tata Ace EV", emissions: 0, fuelType: "Electric", type: "Van" },
                { vehicleId: "veh-009", vehicleNumber: "KA-05-RS-2468", model: "Mahindra eVerito", emissions: 0, fuelType: "Electric", type: "Van" },
                
                // Petrol vehicles (2) - low emissions (bikes)
                { vehicleId: "veh-007", vehicleNumber: "MH-05-XY-8901", model: "Hero Splendor", emissions: 125.3, fuelType: "Petrol", type: "Bike" },
                { vehicleId: "veh-008", vehicleNumber: "DL-03-PQ-4567", model: "Honda Activa", emissions: 98.2, fuelType: "Petrol", type: "Bike" }
            ],
            monthlyEmissions: [
                { month: "July", emissions: 9850, target: 10000 },
                { month: "August", emissions: 9520, target: 10000 },
                { month: "September", emissions: 9180, target: 10000 },
                { month: "October", emissions: 8890, target: 10000 },
                { month: "November", emissions: 8420, target: 10000 },
                { month: "December", emissions: 8021, target: 10000 }
            ]
        };

        return NextResponse.json(dummySustainabilityData);
    } catch (error) {
        console.error("Error fetching sustainability data:", error);
        return NextResponse.json(
            { message: "Failed to fetch sustainability data" },
            { status: 500 }
        );
    }
}
