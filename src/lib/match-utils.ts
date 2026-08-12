import type { MatrimonialProfile } from '@/types';
import { HEIGHTS } from '@/lib/constants';

/**
 * Convert a height string like "5'6\"" to an index in the HEIGHTS array
 * for numeric comparison. Returns -1 if not found.
 */
function heightToIndex(height: string | undefined): number {
  if (!height) return -1;
  return HEIGHTS.indexOf(height as (typeof HEIGHTS)[number]);
}

interface MatchCriterion {
  key: string;
  label: string;
  weight: number;
  matched: boolean;
  applicable: boolean;
}

export interface MatchResult {
  percentage: number;
  criteria: MatchCriterion[];
}

/**
 * Calculate how well a candidate profile matches the logged-in user's
 * partner preferences. Returns a percentage (0–100) and a breakdown
 * of individual criteria.
 *
 * If the user has not set any preferences, returns 0% with no criteria.
 * Criteria where the user did not express a preference are excluded and
 * their weight is redistributed proportionally among the active criteria.
 */
export function calculateMatchPercentage(
  myProfile: MatrimonialProfile,
  candidate: MatrimonialProfile
): MatchResult {
  const criteria: MatchCriterion[] = [];

  // -- Age range (base weight 20%) --
  const hasAgePref = !!(myProfile.pref_age_min || myProfile.pref_age_max);
  if (hasAgePref && candidate.age) {
    const min = myProfile.pref_age_min || 0;
    const max = myProfile.pref_age_max || 100;
    criteria.push({
      key: 'age',
      label: 'Age',
      weight: 20,
      matched: candidate.age >= min && candidate.age <= max,
      applicable: true,
    });
  }

  // -- Height range (base weight 10%) --
  const hasHeightPref = !!(myProfile.pref_height_min || myProfile.pref_height_max);
  if (hasHeightPref && candidate.height) {
    const candidateIdx = heightToIndex(candidate.height);
    const minIdx = myProfile.pref_height_min ? heightToIndex(myProfile.pref_height_min) : 0;
    const maxIdx = myProfile.pref_height_max ? heightToIndex(myProfile.pref_height_max) : HEIGHTS.length - 1;
    const matched = candidateIdx >= 0 && candidateIdx >= minIdx && candidateIdx <= maxIdx;
    criteria.push({
      key: 'height',
      label: 'Height',
      weight: 10,
      matched,
      applicable: true,
    });
  }

  // -- Education (base weight 15%) --
  if (myProfile.pref_education && candidate.education) {
    criteria.push({
      key: 'education',
      label: 'Education',
      weight: 15,
      matched: candidate.education.toLowerCase() === myProfile.pref_education.toLowerCase(),
      applicable: true,
    });
  }

  // -- Profession (base weight 10%) --
  if (myProfile.pref_profession && candidate.profession) {
    criteria.push({
      key: 'profession',
      label: 'Profession',
      weight: 10,
      matched: candidate.profession.toLowerCase().includes(myProfile.pref_profession.toLowerCase()) ||
               myProfile.pref_profession.toLowerCase().includes(candidate.profession.toLowerCase()),
      applicable: true,
    });
  }

  // -- City (base weight 15%) --
  if (myProfile.pref_city && candidate.city) {
    criteria.push({
      key: 'city',
      label: 'City',
      weight: 15,
      matched: candidate.city === myProfile.pref_city,
      applicable: true,
    });
  }

  // -- Diet (base weight 10%) --
  if (myProfile.pref_diet && candidate.diet) {
    criteria.push({
      key: 'diet',
      label: 'Diet',
      weight: 10,
      matched: candidate.diet === myProfile.pref_diet,
      applicable: true,
    });
  }

  // -- Marital Status (base weight 10%) --
  if (myProfile.pref_marital_status && candidate.marital_status) {
    criteria.push({
      key: 'maritalStatus',
      label: 'Marital Status',
      weight: 10,
      matched: candidate.marital_status === myProfile.pref_marital_status,
      applicable: true,
    });
  }

  // -- Religion & Caste (base weight 10%: 5% religion + 5% caste) --
  if (myProfile.religion && candidate.religion) {
    const religionMatch = candidate.religion === myProfile.religion;
    const casteMatch = myProfile.caste && candidate.caste
      ? candidate.caste === myProfile.caste
      : false;

    // Religion part (5%)
    criteria.push({
      key: 'religion',
      label: 'Religion',
      weight: 5,
      matched: religionMatch,
      applicable: true,
    });

    // Caste part (5%) - only if user has caste set
    if (myProfile.caste) {
      criteria.push({
        key: 'caste',
        label: 'Caste',
        weight: 5,
        matched: casteMatch,
        applicable: true,
      });
    }
  }

  // -- No preferences set at all --
  if (criteria.length === 0) {
    return { percentage: 0, criteria: [] };
  }

  // -- Calculate percentage with weight redistribution --
  const totalBaseWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
  const matchedWeight = criteria
    .filter(c => c.matched)
    .reduce((sum, c) => sum + c.weight, 0);

  // Scale to 100%: if only some criteria are active, redistribute
  const percentage = totalBaseWeight > 0
    ? Math.round((matchedWeight / totalBaseWeight) * 100)
    : 0;

  return { percentage, criteria };
}
