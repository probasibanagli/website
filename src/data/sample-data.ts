import { Listing, FoodListing, Hospital, BloodBank, CommunityGroup, MatrimonialProfile, College, Event, BlogPost } from '@/types';

export const sampleListings: Listing[] = [
  {
    id: '1', type: 'pg', name: 'Kolkata Home PG', description: 'Bengali-friendly PG with home-cooked Bengali food. Located near Guindy metro station. Clean rooms with AC and WiFi. Separate floors for boys and girls.', city: 'Chennai', area: 'Guindy', address: '45, 2nd Cross Street, Guindy, Chennai - 600032',
    price_per_month: 8500, room_type: 'double', gender: 'male', amenities: ['Bengali Food', 'AC', 'WiFi', 'Laundry', 'Power Backup'], bengali_friendly: true, bengali_food: true,
    owner_name: 'Subhash Mondal', owner_phone: '9876543210', owner_whatsapp: '9876543210', google_maps_url: 'https://maps.google.com/?q=Guindy,Chennai', lat: 13.0067, lng: 80.2206,
    images: [], verified: true, available_rooms: 3, deposit_amount: 10000, created_at: '2025-01-15',
  },
  {
    id: '2', type: 'pg', name: 'Bengal Nest Ladies PG', description: 'Safe and secure ladies PG near Anna Nagar. Bengali tiffin available. Walking distance to metro. CCTV surveillance and biometric entry.', city: 'Chennai', area: 'Anna Nagar', address: '12, W Block, Anna Nagar, Chennai - 600040',
    price_per_month: 9500, room_type: 'double', gender: 'female', amenities: ['Bengali Food', 'AC', 'WiFi', 'CCTV', 'Biometric Entry'], bengali_friendly: true, bengali_food: true,
    owner_name: 'Rupa Das', owner_phone: '9876543211', owner_whatsapp: '9876543211', google_maps_url: 'https://maps.google.com/?q=Anna+Nagar,Chennai', lat: 13.0850, lng: 80.2101,
    images: [], verified: true, available_rooms: 2, deposit_amount: 12000, created_at: '2025-02-10',
  },
  {
    id: '3', type: 'hotel', name: 'Hotel Bengal Inn', description: 'Budget hotel with Bengali restaurant. Ideal for short stays and tourists. Near T. Nagar bus stand. Room service available 24/7.', city: 'Chennai', area: 'T. Nagar', address: '78, Usman Road, T. Nagar, Chennai - 600017',
    price_per_month: 15000, room_type: 'single', gender: 'mixed', amenities: ['Restaurant', 'AC', 'WiFi', 'Room Service', '24/7 Reception'], bengali_friendly: true, bengali_food: true,
    owner_name: 'Hotel Bengal Inn', owner_phone: '9876543212', owner_whatsapp: '9876543212', google_maps_url: 'https://maps.google.com/?q=T.Nagar,Chennai', lat: 13.0418, lng: 80.2341,
    images: [], verified: true, available_rooms: 8, deposit_amount: 5000, created_at: '2025-01-20',
  },
  {
    id: '4', type: 'rental', name: '2BHK Flat - Velachery', description: 'Fully furnished 2BHK apartment in a gated community. Bengali family preferred. Close to Phoenix Mall and Velachery railway station.', city: 'Chennai', area: 'Velachery', address: 'Sunshine Apartments, Velachery Main Road, Chennai - 600042',
    price_per_month: 18000, room_type: 'double', gender: 'mixed', amenities: ['Furnished', 'AC', 'WiFi', 'Parking', 'Gym', 'Security'], bengali_friendly: true, bengali_food: false,
    owner_name: 'Amit Roy', owner_phone: '9876543213', owner_whatsapp: '9876543213', google_maps_url: 'https://maps.google.com/?q=Velachery,Chennai', lat: 12.9815, lng: 80.2180,
    images: [], verified: false, available_rooms: 1, deposit_amount: 50000, created_at: '2025-03-01',
  },
  {
    id: '5', type: 'pg', name: 'Bangla Bhavan PG', description: 'Premium PG with authentic Bengali meals. Near VIT campus. Ideal for students. Common study area and recreation room.', city: 'Vellore', area: 'Katpadi', address: '23, College Road, Katpadi, Vellore - 632006',
    price_per_month: 7000, room_type: 'triple', gender: 'male', amenities: ['Bengali Food', 'WiFi', 'Study Room', 'Laundry'], bengali_friendly: true, bengali_food: true,
    owner_name: 'Pranab Ghosh', owner_phone: '9876543214', owner_whatsapp: '9876543214', google_maps_url: 'https://maps.google.com/?q=Katpadi,Vellore', lat: 12.9692, lng: 79.1559,
    images: [], verified: true, available_rooms: 5, deposit_amount: 7000, created_at: '2025-01-05',
  },
  {
    id: '6', type: 'pg', name: 'Didi\'s Home PG', description: 'Women-only PG near SRM University. Homely atmosphere with Bengali style cooking. Washing machine and common kitchen available.', city: 'Chennai', area: 'Potheri', address: 'SRM Nagar, Potheri, Chennai - 603203',
    price_per_month: 6500, room_type: 'double', gender: 'female', amenities: ['Bengali Food', 'WiFi', 'Kitchen', 'Washing Machine'], bengali_friendly: true, bengali_food: true,
    owner_name: 'Sharmila Dey', owner_phone: '9876543215', owner_whatsapp: '9876543215', google_maps_url: 'https://maps.google.com/?q=Potheri,Chennai', lat: 12.8231, lng: 80.0440,
    images: [], verified: true, available_rooms: 4, deposit_amount: 6500, created_at: '2025-02-15',
  },
];

export const sampleFoodListings: FoodListing[] = [
  { id: '1', name: 'Kolkata Kitchen', type: 'restaurant', city: 'Chennai', area: 'T. Nagar', address: '34, South Usman Road, T. Nagar', phone: '9876543220', whatsapp: '9876543220', specialties: ['Hilsa Fish', 'Kosha Mangsho', 'Luchi Alur Dom', 'Chingri Malaikari'], images: [], verified: true, created_at: '2025-01-01', google_maps_url: 'https://maps.google.com/?q=T.Nagar,Chennai' },
  { id: '2', name: 'Mishti Hub', type: 'sweets', city: 'Chennai', area: 'Anna Nagar', address: '56, 2nd Avenue, Anna Nagar', phone: '9876543221', whatsapp: '9876543221', specialties: ['Rosogolla', 'Mishti Doi', 'Sandesh', 'Pantua', 'Chomchom'], images: [], verified: true, created_at: '2025-01-10', google_maps_url: 'https://maps.google.com/?q=Anna+Nagar,Chennai' },
  { id: '3', name: 'Banglar Rannaghar', type: 'tiffin', city: 'Chennai', area: 'Guindy', address: 'Home delivery only - Guindy area', phone: '9876543222', whatsapp: '9876543222', specialties: ['Bengali Thali', 'Fish Curry', 'Dal-Bhaat', 'Shukto'], images: [], verified: true, created_at: '2025-02-01', google_maps_url: '' },
  { id: '4', name: 'Bong Bites', type: 'delivery', city: 'Chennai', area: 'Velachery', address: 'Online delivery - Chennai wide', phone: '9876543223', whatsapp: '9876543223', specialties: ['Kathi Rolls', 'Egg Devil', 'Mughlai Paratha', 'Chicken Chaap'], zomato_url: 'https://zomato.com', swiggy_url: 'https://swiggy.com', images: [], verified: false, created_at: '2025-02-15', google_maps_url: '' },
  { id: '5', name: 'Barir Ranna', type: 'restaurant', city: 'Coimbatore', area: 'Gandhipuram', address: '12, Cross Cut Road, Gandhipuram', phone: '9876543224', whatsapp: '9876543224', specialties: ['Bengali Thali', 'Chingri Bhapa', 'Begun Bhaja', 'Payesh'], images: [], verified: true, created_at: '2025-03-01', google_maps_url: 'https://maps.google.com/?q=Gandhipuram,Coimbatore' },
  { id: '6', name: 'Kolkata Sweets Palace', type: 'sweets', city: 'Vellore', area: 'Katpadi', address: 'Near VIT Main Gate, Katpadi', phone: '9876543225', whatsapp: '9876543225', specialties: ['Rosogolla', 'Langcha', 'Mihidana', 'Sitabhog'], images: [], verified: true, created_at: '2025-02-20', google_maps_url: 'https://maps.google.com/?q=Katpadi,Vellore' },
];

export const sampleHospitals: Hospital[] = [
  { id: '1', name: 'Apollo Hospital', city: 'Chennai', area: 'Greams Road', address: '21, Greams Lane, Off Greams Road, Chennai - 600006', phone: '044-28290200', emergency_phone: '044-28293333', specializations: ['Cardiology', 'Orthopedic', 'General Medicine', 'Emergency'], is_24_7: true, has_bengali_doctor: true, google_maps_url: 'https://maps.google.com/?q=Apollo+Hospital+Chennai', lat: 13.0604, lng: 80.2496, created_at: '2025-01-01' },
  { id: '2', name: 'MIOT International', city: 'Chennai', area: 'Manapakkam', address: '4/112, Mount Poonamallee Road, Manapakkam', phone: '044-42002288', emergency_phone: '044-42002200', specializations: ['Orthopedic', 'General Medicine', 'Pediatrics', 'Emergency'], is_24_7: true, has_bengali_doctor: false, google_maps_url: 'https://maps.google.com/?q=MIOT+Hospital+Chennai', lat: 13.0190, lng: 80.1626, created_at: '2025-01-01' },
  { id: '3', name: 'Sri Ramachandra Medical Centre', city: 'Chennai', area: 'Porur', address: 'No.1, Ramachandra Nagar, Porur, Chennai - 600116', phone: '044-24768027', emergency_phone: '044-24765000', specializations: ['Cardiology', 'ENT', 'Gynecology', 'Dental'], is_24_7: true, has_bengali_doctor: true, google_maps_url: 'https://maps.google.com/?q=Sri+Ramachandra+Hospital+Chennai', lat: 13.0340, lng: 80.1420, created_at: '2025-01-01' },
  { id: '4', name: 'CMC Hospital', city: 'Vellore', area: 'CMC Campus', address: 'Ida Scudder Road, Vellore - 632004', phone: '0416-2281000', emergency_phone: '0416-2282010', specializations: ['General Medicine', 'Pediatrics', 'Orthopedic', 'Cardiology', 'Emergency'], is_24_7: true, has_bengali_doctor: true, google_maps_url: 'https://maps.google.com/?q=CMC+Hospital+Vellore', lat: 12.9249, lng: 79.1325, created_at: '2025-01-01' },
  { id: '5', name: 'Kauvery Hospital', city: 'Chennai', area: 'Alwarpet', address: '199, Luz Church Road, Mylapore, Chennai - 600004', phone: '044-40006000', emergency_phone: '044-40006000', specializations: ['Cardiology', 'General Medicine', 'Emergency'], is_24_7: true, has_bengali_doctor: false, google_maps_url: 'https://maps.google.com/?q=Kauvery+Hospital+Chennai', lat: 13.0356, lng: 80.2571, created_at: '2025-01-01' },
  { id: '6', name: 'Ramakrishna Hospital', city: 'Coimbatore', area: 'RS Puram', address: '395, Sarojini Naidu Road, Siddhapudur, Coimbatore', phone: '0422-4500000', emergency_phone: '0422-4500000', specializations: ['General Medicine', 'ENT', 'Gynecology', 'Pediatrics'], is_24_7: true, has_bengali_doctor: false, google_maps_url: 'https://maps.google.com/?q=Ramakrishna+Hospital+Coimbatore', lat: 11.0068, lng: 76.9558, created_at: '2025-01-01' },
];

export const sampleBloodBanks: BloodBank[] = [
  { id: '1', name: 'Adyar Cancer Institute Blood Bank', city: 'Chennai', address: 'East Canal Bank Road, Gandhi Nagar, Adyar, Chennai', phone: '044-24910754', available_groups: ['A+', 'B+', 'O+', 'AB+'], google_maps_url: 'https://maps.google.com/?q=Adyar+Cancer+Institute+Chennai' },
  { id: '2', name: 'Apollo Blood Bank', city: 'Chennai', address: '21, Greams Lane, Chennai - 600006', phone: '044-28290200', available_groups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'], google_maps_url: 'https://maps.google.com/?q=Apollo+Blood+Bank+Chennai' },
  { id: '3', name: 'CMC Blood Bank', city: 'Vellore', address: 'Ida Scudder Road, Vellore - 632004', phone: '0416-2281000', available_groups: ['A+', 'B+', 'O+', 'O-', 'AB+'], google_maps_url: 'https://maps.google.com/?q=CMC+Blood+Bank+Vellore' },
  { id: '4', name: 'IRT Blood Bank', city: 'Chennai', address: 'Perungalathur, Chennai - 600063', phone: '044-22781234', available_groups: ['A+', 'B+', 'O+', 'AB+', 'B-'], google_maps_url: 'https://maps.google.com/?q=IRT+Blood+Bank+Chennai' },
  { id: '5', name: 'Rotary Blood Bank', city: 'Coimbatore', address: 'Avinashi Road, Coimbatore - 641018', phone: '0422-2301234', available_groups: ['A+', 'A-', 'B+', 'O+', 'O-', 'AB+'], google_maps_url: 'https://maps.google.com/?q=Rotary+Blood+Bank+Coimbatore' },
];

export const sampleCommunityGroups: CommunityGroup[] = [
  { id: '1', name: 'Bengalis in Chennai', platform: 'whatsapp', city: 'Chennai', description: 'Main WhatsApp group for all Bengalis in Chennai. Share tips, find help, and connect!', member_count: 450, join_url: 'https://chat.whatsapp.com/example1', category: 'general' },
  { id: '2', name: 'Bengali Students TN', platform: 'telegram', city: 'Chennai', description: 'Students from Bengal studying in Tamil Nadu colleges. Exam tips, notes, and fun!', member_count: 320, join_url: 'https://t.me/example2', category: 'students' },
  { id: '3', name: 'Bengali Professionals Chennai', platform: 'whatsapp', city: 'Chennai', description: 'Working professionals group for networking, job referrals and meetups.', member_count: 180, join_url: 'https://chat.whatsapp.com/example3', category: 'professionals' },
  { id: '4', name: 'Bangali Mohila Sangha', platform: 'whatsapp', city: 'Chennai', description: 'Women-only group for Bengali women in Chennai. Support, recipes, and community.', member_count: 200, join_url: 'https://chat.whatsapp.com/example4', category: 'women' },
  { id: '5', name: 'VIT Bengali Students', platform: 'whatsapp', city: 'Vellore', description: 'Bengali students at VIT Vellore. Campus life, events, and help.', member_count: 280, join_url: 'https://chat.whatsapp.com/example5', category: 'students' },
  { id: '6', name: 'Bangali Adda Coimbatore', platform: 'facebook', city: 'Coimbatore', description: 'Facebook group for Bengalis in Coimbatore. Events, food finds, and meetups.', member_count: 150, join_url: 'https://facebook.com/groups/example6', category: 'general' },
];

export const sampleMatrimonialProfiles: MatrimonialProfile[] = [
  { id: '1', user_id: 'u1', full_name: 'Aniket Banerjee', age: 28, gender: 'male', city: 'Chennai', native_district: 'Kolkata', education: 'B.Tech, IIT Madras', profession: 'Software Engineer', annual_income: '12-15 LPA', religion: 'Hindu', caste: 'Brahmin', about_me: 'Working in IT sector. Love reading, traveling and cooking.', partner_preference: 'Educated Bengali girl, open-minded and family-oriented.', verified: true, published: true, contact_visible_after_login: true, created_at: '2025-01-01' },
  { id: '2', user_id: 'u2', full_name: 'Priyanka Ghosh', age: 25, gender: 'female', city: 'Chennai', native_district: 'Howrah', education: 'MBA, Anna University', profession: 'Marketing Manager', annual_income: '8-10 LPA', religion: 'Hindu', caste: '', about_me: 'Passionate about travel, art and Bengali cuisine.', partner_preference: 'Well-educated Bengali boy with good values.', verified: true, published: true, contact_visible_after_login: true, created_at: '2025-02-01' },
  { id: '3', user_id: 'u3', full_name: 'Sourav Mukherjee', age: 30, gender: 'male', city: 'Coimbatore', native_district: 'Burdwan', education: 'M.Tech', profession: 'Mechanical Engineer', annual_income: '10-12 LPA', religion: 'Hindu', caste: '', about_me: 'Working in manufacturing sector. Sports enthusiast.', partner_preference: 'Bengali girl who values family traditions.', verified: false, published: true, contact_visible_after_login: true, created_at: '2025-02-15' },
  { id: '4', user_id: 'u4', full_name: 'Ananya Dutta', age: 26, gender: 'female', city: 'Vellore', native_district: 'Durgapur', education: 'MBBS, CMC Vellore', profession: 'Doctor', annual_income: '15-20 LPA', religion: 'Hindu', caste: '', about_me: 'Doctor by profession, Bengali at heart. Love music and dance.', partner_preference: 'Well-settled Bengali professional.', verified: true, published: true, contact_visible_after_login: true, created_at: '2025-03-01' },
];

export const sampleColleges: College[] = [
  { id: '1', name: 'IIT Madras', type: 'engineering', city: 'Chennai', area: 'Guindy', address: 'IIT P.O., Chennai - 600036', phone: '044-22578100', website: 'https://www.iitm.ac.in', google_maps_url: 'https://maps.google.com/?q=IIT+Madras' },
  { id: '2', name: 'VIT University', type: 'engineering', city: 'Vellore', area: 'Katpadi', address: 'VIT Campus, Katpadi, Vellore - 632014', phone: '0416-2202300', website: 'https://vit.ac.in', google_maps_url: 'https://maps.google.com/?q=VIT+Vellore' },
  { id: '3', name: 'Anna University', type: 'engineering', city: 'Chennai', area: 'Guindy', address: 'Sardar Patel Road, Guindy, Chennai - 600025', phone: '044-22358190', website: 'https://www.annauniv.edu', google_maps_url: 'https://maps.google.com/?q=Anna+University+Chennai' },
  { id: '4', name: 'CMC Vellore', type: 'medical', city: 'Vellore', area: 'CMC Campus', address: 'Ida Scudder Road, Vellore - 632004', phone: '0416-2281000', website: 'https://www.cmch-vellore.edu', google_maps_url: 'https://maps.google.com/?q=CMC+Vellore' },
  { id: '5', name: 'SRM Institute', type: 'engineering', city: 'Chennai', area: 'Potheri', address: 'SRM Nagar, Kattankulathur - 603203', phone: '044-27417000', website: 'https://www.srmist.edu.in', google_maps_url: 'https://maps.google.com/?q=SRM+University+Chennai' },
  { id: '6', name: 'Madras Medical College', type: 'medical', city: 'Chennai', area: 'Park Town', address: 'Park Town, Chennai - 600003', phone: '044-25305000', website: 'https://mmc.tn.gov.in', google_maps_url: 'https://maps.google.com/?q=Madras+Medical+College' },
];

export const sampleEvents: Event[] = [
  { id: '1', title: 'Durga Puja 2025 — Chennai', description: 'Grand Durga Puja celebration at Deshapriya Park, T.Nagar. 5 days of cultural programs, Bengali food stalls, dhunuchi naach.', event_date: '2025-10-01', city: 'Chennai', venue: 'Deshapriya Park, T.Nagar', organizer: 'Chennai Bengali Association', contact: '9876543230', category: 'festival' },
  { id: '2', title: 'Saraswati Puja', description: 'Saraswati Puja celebration with pushpanjali, cultural events and prasad distribution.', event_date: '2025-02-02', city: 'Chennai', venue: 'Bengali Club, Anna Nagar', organizer: 'Anna Nagar Bengali Sabha', contact: '9876543231', category: 'religious' },
  { id: '3', title: 'Bengali New Year (Poila Boishakh)', description: 'Celebrate Poila Boishakh with music, dance, and traditional Bengali food.', event_date: '2025-04-15', city: 'Chennai', venue: 'Kalaivanar Arangam', organizer: 'ProbasiBangali Chennai', contact: '9876543232', category: 'cultural' },
  { id: '4', title: 'Rabindra Jayanti', description: 'Tribute to Rabindranath Tagore with recitations, songs, and drama.', event_date: '2025-05-09', city: 'Vellore', venue: 'VIT Auditorium', organizer: 'VIT Bengali Students Club', contact: '9876543233', category: 'cultural' },
  { id: '5', title: 'Community Meetup — Coimbatore', description: 'Monthly meetup for Bengali families in Coimbatore. Food, fun and networking.', event_date: '2025-04-20', city: 'Coimbatore', venue: 'Hotel Residency Towers', organizer: 'Coimbatore Banga Samaj', contact: '9876543234', category: 'social' },
];

export const sampleBlogPosts: BlogPost[] = [
  { id: '1', title: 'Top 10 Bengali Restaurants in Chennai', slug: 'top-bengali-restaurants-chennai', excerpt: 'Missing home food? Here are the best places to find authentic Bengali cuisine in Chennai.', author: 'ProbasiBangali Team', tags: ['food', 'chennai', 'restaurants'], published: true, created_at: '2025-03-01' },
  { id: '2', title: 'How to Find Bengali-Friendly PG in Tamil Nadu', slug: 'find-bengali-pg-tamil-nadu', excerpt: 'A complete guide for Bengali students and professionals looking for accommodation.', author: 'ProbasiBangali Team', tags: ['accommodation', 'guide', 'pg'], published: true, created_at: '2025-03-10' },
  { id: '3', title: 'Durga Puja in Chennai — A Complete Guide', slug: 'durga-puja-chennai-guide', excerpt: 'Everything you need to know about celebrating Durga Puja in Chennai.', author: 'ProbasiBangali Team', tags: ['festival', 'durga puja', 'chennai'], published: true, created_at: '2025-03-15' },
];
