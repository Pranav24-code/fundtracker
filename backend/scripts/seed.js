require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Project = require('../src/models/Project');
const Complaint = require('../src/models/Complaint');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ MongoDB connected for seeding');
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Project.deleteMany();
    await Complaint.deleteMany();

    console.log('🗑️  Existing data cleared');

    // Create users
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@petms.gov.in',
        password: 'Admin@123',
        role: 'admin',
        phone: '9876543210',
      },
      {
        name: 'Rajesh Kumar (Contractor)',
        email: 'contractor@example.com',
        password: 'Contractor@123',
        role: 'contractor',
        phone: '9876543211',
      },
      {
        name: 'Priya Sharma (Contractor)',
        email: 'contractor2@example.com',
        password: 'Contractor@123',
        role: 'contractor',
        phone: '9876543213',
      },
      {
        name: 'Amit Citizen',
        email: 'citizen@example.com',
        password: 'Citizen@123',
        role: 'citizen',
        phone: '9876543212',
      },
      {
        name: 'Sunita Verma',
        email: 'citizen2@example.com',
        password: 'Citizen@123',
        role: 'citizen',
        phone: '9876543214',
      },
    ]);

    console.log('✅ Users created');

    const contractor1 = users[1]._id;
    const contractor2 = users[2]._id;
    const citizen1 = users[3]._id;
    const citizen2 = users[4]._id;

    // Create projects
    const projects = await Project.create([
      {
        title: 'Mumbai-Pune Expressway Phase 2',
        description: 'Widening and improvement of existing expressway with 6-lane highway expansion',
        department: 'Roads & Infrastructure',
        location: {
          address: 'Mumbai-Pune Expressway',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          coordinates: { latitude: 19.076, longitude: 72.8777 },
        },
        totalBudget: 5000000000,
        amountSpent: 3500000000,
        completionPercentage: 70,
        startDate: new Date('2024-01-15'),
        expectedEndDate: new Date('2026-12-31'),
        status: 'On Time',
        contractor: contractor1,
      },
      {
        title: 'AIIMS Nagpur Construction',
        description: 'Construction of new All India Institute of Medical Sciences facility in Nagpur',
        department: 'Healthcare',
        location: {
          address: 'MIHAN, Nagpur',
          city: 'Nagpur',
          state: 'Maharashtra',
          pincode: '440001',
          coordinates: { latitude: 21.1458, longitude: 79.0882 },
        },
        totalBudget: 4500000000,
        amountSpent: 4200000000,
        completionPercentage: 45,
        startDate: new Date('2023-06-01'),
        expectedEndDate: new Date('2025-06-30'),
        status: 'Delayed',
        riskFlag: true,
        riskFactors: ['BUDGET_OVERRUN'],
        contractor: contractor1,
      },
      {
        title: 'Delhi Smart City Initiative',
        description: 'Smart traffic management and IoT-based waste management system deployment',
        department: 'Smart City',
        location: {
          address: 'Connaught Place',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110001',
          coordinates: { latitude: 28.6139, longitude: 77.209 },
        },
        totalBudget: 3200000000,
        amountSpent: 1600000000,
        completionPercentage: 55,
        startDate: new Date('2024-03-01'),
        expectedEndDate: new Date('2026-03-01'),
        status: 'On Time',
        contractor: contractor2,
      },
      {
        title: 'Bangalore Water Supply Upgrade',
        description: 'Upgrading water supply pipeline network for Bangalore city covering 500km of new pipelines',
        department: 'Water Supply',
        location: {
          address: 'Majestic Area',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
          coordinates: { latitude: 12.9716, longitude: 77.5946 },
        },
        totalBudget: 2800000000,
        amountSpent: 2700000000,
        completionPercentage: 30,
        startDate: new Date('2023-09-01'),
        expectedEndDate: new Date('2025-03-31'),
        status: 'Critical',
        riskFlag: true,
        riskFactors: ['BUDGET_OVERRUN', 'TIMELINE_DELAY'],
        contractor: contractor1,
      },
      {
        title: 'Chennai Metro Phase 2',
        description: 'Extension of Chennai Metro Rail covering Sholinganallur to Airport corridor',
        department: 'Roads & Infrastructure',
        location: {
          address: 'Sholinganallur',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600119',
          coordinates: { latitude: 12.9001, longitude: 80.2278 },
        },
        totalBudget: 8500000000,
        amountSpent: 4250000000,
        completionPercentage: 50,
        startDate: new Date('2023-01-01'),
        expectedEndDate: new Date('2027-06-30'),
        status: 'On Time',
        contractor: contractor2,
      },
      {
        title: 'Hyderabad IT Park Development',
        description: 'Development of new IT park in Gachibowli area with world-class infrastructure',
        department: 'Smart City',
        location: {
          address: 'Gachibowli',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500032',
          coordinates: { latitude: 17.44, longitude: 78.3489 },
        },
        totalBudget: 1500000000,
        amountSpent: 750000000,
        completionPercentage: 60,
        startDate: new Date('2024-06-01'),
        expectedEndDate: new Date('2026-06-01'),
        status: 'On Time',
        contractor: contractor1,
      },
      {
        title: 'Kolkata School Renovation Program',
        description: 'Renovation and modernization of 200 government schools in Kolkata municipal area',
        department: 'Education',
        location: {
          address: 'Park Street Area',
          city: 'Kolkata',
          state: 'West Bengal',
          pincode: '700016',
          coordinates: { latitude: 22.5726, longitude: 88.3639 },
        },
        totalBudget: 800000000,
        amountSpent: 400000000,
        completionPercentage: 55,
        startDate: new Date('2024-04-01'),
        expectedEndDate: new Date('2025-12-31'),
        status: 'On Time',
        contractor: contractor2,
      },
      {
        title: 'Jaipur Solar Power Plant',
        description: 'Construction of 200MW solar power plant in Jaipur outskirts',
        department: 'Energy',
        location: {
          address: 'Sanganer',
          city: 'Jaipur',
          state: 'Rajasthan',
          pincode: '302029',
          coordinates: { latitude: 26.8291, longitude: 75.8058 },
        },
        totalBudget: 6000000000,
        amountSpent: 2400000000,
        completionPercentage: 40,
        startDate: new Date('2024-02-15'),
        expectedEndDate: new Date('2026-08-15'),
        status: 'On Time',
        contractor: contractor1,
      },
      {
        title: 'Lucknow Sanitation Drive',
        description: 'Comprehensive sanitation and drainage improvement for Lucknow city',
        department: 'Sanitation',
        location: {
          address: 'Hazratganj',
          city: 'Lucknow',
          state: 'Uttar Pradesh',
          pincode: '226001',
          coordinates: { latitude: 26.8467, longitude: 80.9462 },
        },
        totalBudget: 1200000000,
        amountSpent: 1150000000,
        completionPercentage: 35,
        startDate: new Date('2023-07-01'),
        expectedEndDate: new Date('2025-01-31'),
        status: 'Critical',
        riskFlag: true,
        riskFactors: ['BUDGET_OVERRUN', 'TIMELINE_DELAY'],
        contractor: contractor2,
      },
      {
        title: 'Ahmedabad Rural Roads Network',
        description: 'Construction of 300km rural road network connecting remote villages',
        department: 'Rural Development',
        location: {
          address: 'Sanand',
          city: 'Ahmedabad',
          state: 'Gujarat',
          pincode: '382110',
          coordinates: { latitude: 22.9924, longitude: 72.3712 },
        },
        totalBudget: 2000000000,
        amountSpent: 1000000000,
        completionPercentage: 50,
        startDate: new Date('2024-01-01'),
        expectedEndDate: new Date('2026-01-01'),
        status: 'On Time',
        contractor: contractor1,
      },
      {
        title: 'Pune Healthcare Centers',
        description: 'Setting up 50 primary healthcare centers across Pune district',
        department: 'Healthcare',
        location: {
          address: 'Shivajinagar',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411005',
          coordinates: { latitude: 18.5204, longitude: 73.8567 },
        },
        totalBudget: 900000000,
        amountSpent: 450000000,
        completionPercentage: 65,
        startDate: new Date('2024-02-01'),
        expectedEndDate: new Date('2025-08-01'),
        status: 'On Time',
        contractor: contractor2,
      },
      {
        title: 'Bhopal Smart Grid Project',
        description: 'Implementation of smart electricity grid with IoT sensors',
        department: 'Energy',
        location: {
          address: 'New Market',
          city: 'Bhopal',
          state: 'Madhya Pradesh',
          pincode: '462001',
          coordinates: { latitude: 23.2599, longitude: 77.4126 },
        },
        totalBudget: 1800000000,
        amountSpent: 900000000,
        completionPercentage: 50,
        startDate: new Date('2024-05-01'),
        expectedEndDate: new Date('2026-05-01'),
        status: 'On Time',
        contractor: contractor1,
      },
      {
        title: 'Guwahati Flood Management System',
        description: 'Construction of flood barriers, drainage systems and early warning infrastructure',
        department: 'Water Supply',
        location: {
          address: 'Fancy Bazar',
          city: 'Guwahati',
          state: 'Assam',
          pincode: '781001',
          coordinates: { latitude: 26.1445, longitude: 91.7362 },
        },
        totalBudget: 3500000000,
        amountSpent: 1750000000,
        completionPercentage: 45,
        startDate: new Date('2023-11-01'),
        expectedEndDate: new Date('2026-11-01'),
        status: 'Delayed',
        riskFlag: false,
        contractor: contractor2,
      },
      {
        title: 'Chandigarh Education Hub',
        description: 'Development of education technology hub with modern classrooms and labs',
        department: 'Education',
        location: {
          address: 'Sector 17',
          city: 'Chandigarh',
          state: 'Chandigarh',
          pincode: '160017',
          coordinates: { latitude: 30.7333, longitude: 76.7794 },
        },
        totalBudget: 600000000,
        amountSpent: 600000000,
        completionPercentage: 100,
        startDate: new Date('2023-03-01'),
        expectedEndDate: new Date('2025-03-01'),
        actualEndDate: new Date('2025-01-15'),
        status: 'Completed',
        contractor: contractor1,
      },
      {
        title: 'Indore Clean City 2.0',
        description: 'Extended waste management system with recycling plants and smart bins',
        department: 'Sanitation',
        location: {
          address: 'Rajwada',
          city: 'Indore',
          state: 'Madhya Pradesh',
          pincode: '452001',
          coordinates: { latitude: 22.7196, longitude: 75.8577 },
        },
        totalBudget: 700000000,
        amountSpent: 350000000,
        completionPercentage: 55,
        startDate: new Date('2024-07-01'),
        expectedEndDate: new Date('2026-01-01'),
        status: 'On Time',
        contractor: contractor2,
      },
      {
        title: 'Varanasi Heritage Walkway',
        description: 'Construction of heritage walkway along the ghats with lighting and safety features',
        department: 'Others',
        location: {
          address: 'Dashashwamedh Ghat',
          city: 'Varanasi',
          state: 'Uttar Pradesh',
          pincode: '221001',
          coordinates: { latitude: 25.3176, longitude: 82.9739 },
        },
        totalBudget: 450000000,
        amountSpent: 225000000,
        completionPercentage: 48,
        startDate: new Date('2024-08-01'),
        expectedEndDate: new Date('2025-12-01'),
        status: 'On Time',
        contractor: contractor1,
      },
    ]);

    console.log(`✅ ${projects.length} Projects created`);

    // Create complaints
    await Complaint.create([
      {
        project: projects[1]._id, // AIIMS Nagpur
        citizen: citizen1,
        issueType: 'Budget Misuse',
        description:
          'The construction quality does not match the budget allocated. Materials used appear to be substandard and there are visible cracks in the new wing structure already.',
        location: { latitude: 21.1458, longitude: 79.0882 },
        status: 'Under Review',
        upvotes: 45,
        trackingId: 'CMP2026000001',
      },
      {
        project: projects[3]._id, // Bangalore Water Supply
        citizen: citizen2,
        issueType: 'Timeline Delay',
        description:
          'The water pipeline work in our area has been stalled for the last 3 months with no workers visible at the site. Roads were dug up and left as-is causing major inconvenience.',
        location: { latitude: 12.9716, longitude: 77.5946 },
        status: 'Pending',
        upvotes: 120,
        isCritical: true,
        trackingId: 'CMP2026000002',
      },
      {
        project: projects[8]._id, // Lucknow Sanitation
        citizen: citizen1,
        issueType: 'Work Stopped',
        description:
          'The drainage improvement work in Hazratganj area has completely stopped. Open drains are causing health hazards to nearby residents.',
        location: { latitude: 26.8467, longitude: 80.9462 },
        status: 'Pending',
        upvotes: 78,
        trackingId: 'CMP2026000003',
      },
      {
        project: projects[0]._id, // Mumbai-Pune Expressway
        citizen: citizen2,
        issueType: 'Poor Quality',
        description:
          'The newly laid portion of the expressway near Lonavala already shows signs of deterioration. Potholes forming within 2 months of completion is unacceptable.',
        location: { latitude: 18.7557, longitude: 73.4091 },
        status: 'Resolved',
        upvotes: 200,
        isCritical: true,
        adminResponse: {
          message: 'We have directed the contractor to repair the affected section. Quality audit team has been deployed.',
          respondedBy: users[0]._id,
          respondedAt: new Date('2025-12-15'),
        },
        trackingId: 'CMP2026000004',
      },
      {
        project: projects[12]._id, // Guwahati Flood Management
        citizen: citizen1,
        issueType: 'Other',
        description:
          'The flood barrier construction is blocking normal water flow in the river causing waterlogging in adjacent areas during moderate rain. This needs immediate review.',
        location: { latitude: 26.1445, longitude: 91.7362 },
        status: 'Under Review',
        upvotes: 55,
        trackingId: 'CMP2026000005',
      },
    ]);

    console.log('✅ Complaints created');
    console.log('\n🎉 Seed data inserted successfully!\n');
    console.log('📋 Login Credentials:');
    console.log('   Admin:      admin@petms.gov.in / Admin@123');
    console.log('   Contractor: contractor@example.com / Contractor@123');
    console.log('   Citizen:    citizen@example.com / Citizen@123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
