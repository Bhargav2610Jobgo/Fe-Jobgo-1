import { useGet } from "@/composables/useHttp";

export default function useSkillSearch() {
  const handleSkillSearch = (query) => {
    const queryToSearch = query ? query : "";
    const endpoint = `skills?limit=10&search=${queryToSearch}`;

    return querySkills(endpoint);
  };

  const querySkills = async (endpoint) => {
    const getSkills = useGet(endpoint);
    await getSkills.get();

    return getSkills.data.value?.skills?.map((c) => {
      return { label: c.name, value: c.reference };
    });
  };
  return {
    handleSkillSearch,
  };
}
