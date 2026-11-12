import { useState, useEffect } from "react";
import api from "../services/api";

export default function useProfile(userId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const endpoint = userId ? `/funcionarios/${userId}` : `/profile/meu-perfil`;
        const res = await api.get(endpoint);
        setProfile(res.data?.data || res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [userId]);

  return { profile, loading, error };
}
