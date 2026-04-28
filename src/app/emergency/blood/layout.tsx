import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blood Banks in Tamil Nadu — Search by Blood Group | ProbasiBangali',
  description: 'Find blood banks in Chennai, Coimbatore, Vellore and across Tamil Nadu. Search by blood group (A+, B+, O+, AB+). Direct call buttons for emergencies.',
  keywords: ['blood bank Chennai', 'blood bank Tamil Nadu', 'blood group search', 'donate blood Chennai'],
};

export default function BloodLayout({ children }: { children: React.ReactNode }) {
  return children;
}
