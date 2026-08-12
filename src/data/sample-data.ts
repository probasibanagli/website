import { Listing, FoodListing, Hospital, BloodBank, CommunityGroup, MatrimonialProfile, College, CommunityEvent, BlogPost } from '@/types';

export const cityRestaurants: Record<string, string[]> = {};
export const sampleStayListings: Listing[] = [];
export const sampleFoodListings: FoodListing[] = [];
export const sampleListings: any[] = [];
export const sampleHospitals: Hospital[] = [];
export const sampleBloodBanks: BloodBank[] = [];
export const sampleCommunityGroups: CommunityGroup[] = [];
export const sampleMatrimonialProfiles: MatrimonialProfile[] = [];
export const sampleColleges: College[] = [
  {
    id: 'sboa-chennai',
    category: 'school',
    name: 'SBOA School and Junior College',
    type: 'cbse',
    city: 'Chennai',
    area: 'Anna Nagar',
    address: '18, South Avenue, Anna Nagar Western Extension',
    phone: '044-26151145',
    website: 'http://www.sboajc.org/',
    google_maps_url: 'https://maps.google.com/?cid=12345',
    ranking: 1,
    image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80',
    staff_contacts: [
      {
        name: 'Mr. Anirban Chatterjee',
        role: 'lecturer',
        department: 'Physics',
        phone: '+91 9876543210',
        email: 'anirban@sboajc.org'
      }
    ]
  },
  {
    id: 'kv-iit-chennai',
    category: 'school',
    name: 'Kendriya Vidyalaya IIT Chennai',
    type: 'kv',
    city: 'Chennai',
    area: 'IIT Madras',
    address: 'IIT Campus, Chennai',
    phone: '044-22570043',
    website: 'https://iitchennai.kvs.ac.in/',
    google_maps_url: 'https://maps.google.com/?cid=54321',
    ranking: 2,
    image_url: 'https://images.unsplash.com/photo-1546410531-bea5aad14780?auto=format&fit=crop&q=80',
    staff_contacts: [
      {
        name: 'Mrs. Rupa Ghosh',
        role: 'staff',
        department: 'Administration',
        phone: '+91 9876543211',
        email: 'rupa@kviit.ac.in'
      }
    ]
  },
  {
    id: 'st-judes-nilgiris',
    category: 'school',
    name: 'St. Jude\'s Public School',
    type: 'icse',
    city: 'Ooty',
    area: 'Kotagiri',
    address: 'Kotagiri, Nilgiris',
    phone: '04266-271777',
    website: 'https://stjudes.org/',
    google_maps_url: 'https://maps.google.com/?cid=98765',
    ranking: 1,
    image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80',
    staff_contacts: []
  },
  {
    id: 'chettinad-vidyashram-chennai',
    category: 'school',
    name: 'Chettinad Vidyashram',
    type: 'cbse',
    city: 'Chennai',
    area: 'R.A. Puram',
    address: 'Chettinad House, Rajah Annamalaipuram, Chennai',
    phone: '044-24938040',
    website: 'https://chettinadvidyashram.org/',
    google_maps_url: 'https://maps.google.com/?cid=11111',
    ranking: 3,
    image_url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80',
    staff_contacts: []
  },
  {
    id: 'stanes-coimbatore',
    category: 'school',
    name: 'Stanes Anglo Indian Higher Secondary School',
    type: 'icse',
    city: 'Coimbatore',
    area: 'Avinashi Road',
    address: 'Avinashi Road, Coimbatore',
    phone: '0422-2213897',
    website: 'https://www.stanesschool.org/',
    google_maps_url: 'https://maps.google.com/?cid=22222',
    ranking: 1,
    image_url: 'https://images.unsplash.com/photo-1601807576228-2d83ba0e830c?auto=format&fit=crop&q=80',
    staff_contacts: []
  },
  {
    id: 'kv-narimedu-madurai',
    category: 'school',
    name: 'Kendriya Vidyalaya Narimedu',
    type: 'kv',
    city: 'Madurai',
    area: 'Narimedu',
    address: 'PT Rajan Road, Narimedu, Madurai',
    phone: '0452-2531393',
    website: 'https://narimedu.kvs.ac.in/',
    google_maps_url: 'https://maps.google.com/?cid=33333',
    ranking: 2,
    image_url: 'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?auto=format&fit=crop&q=80',
    staff_contacts: []
  },
  {
    id: 'rsk-trichy',
    category: 'school',
    name: 'RSK Higher Secondary School',
    type: 'cbse',
    city: 'Trichy',
    area: 'Kailasapuram',
    address: 'Kailasapuram, BHEL Township, Trichy',
    phone: '0431-2520333',
    website: 'https://www.rskschool.in/',
    google_maps_url: 'https://maps.google.com/?cid=44444',
    ranking: 2,
    image_url: 'https://images.unsplash.com/photo-1576495199011-eb94736d05d6?auto=format&fit=crop&q=80',
    staff_contacts: []
  }
];
export const sampleEvents: CommunityEvent[] = [];
export const sampleBlogPosts: BlogPost[] = [];
